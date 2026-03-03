from django.conf import settings
from django.db import models
from django.utils.text import slugify
from goals.models import Goal
from ingredients.models import Ingredient
from django.core.validators import MinValueValidator, MaxValueValidator



class Recipe(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="recipes")
    goal = models.ForeignKey(Goal, on_delete=models.SET_NULL, null=True, related_name="recipes")
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)

    difficulty = models.CharField(max_length=20, blank=True)
    diet_type = models.CharField(max_length=50, blank=True)
    instructions = models.TextField(blank=True)
    meal_type = models.CharField(max_length=20, blank=True)
    meal_time = models.CharField(max_length=50, blank=True)

    prep_time = models.PositiveIntegerField(default=0, help_text="Preparation time in minutes")
    cook_time = models.PositiveIntegerField(default=0, help_text="Cooking time in minutes")
    servings = models.PositiveIntegerField(default=1)

    calories = models.FloatField(default=0)
    protein = models.FloatField(default=0)
    carbs = models.FloatField(default=0)
    fat = models.FloatField(default=0)
    fiber = models.FloatField(default=0)
    vitamin_a = models.FloatField(default=0)
    vitamin_c = models.FloatField(default=0)
    iron = models.FloatField(default=0)
    calcium = models.FloatField(default=0)
    potassium = models.FloatField(default=0)

    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    average_rating = models.FloatField(default=0)
    rating_count = models.PositiveIntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            counter = 1
            while Recipe.objects.filter(slug=slug).exists():
                slug = f"{base}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    
    class Meta:
        indexes = [models.Index(fields=["slug"])]



class RecipeMedia(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="media")
    image_url = models.ImageField(upload_to="recipes/", blank=True, null=True)
    video_url = models.FileField(upload_to="recipes/videos/", blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.recipe.title} media"


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="recipe_ingredients")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    grams = models.FloatField(default=0)

    def __str__(self):
        return f"{self.recipe.title} - {self.ingredient.name}"
    
class RecipeReview(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="reviews", db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("recipe", "user")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.recipe.title} - {self.rating}"
    

class RecipeComment(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="replies"
    )
    text = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["recipe", "created_at"]),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.recipe.title}"


class RecipeLike(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("recipe", "user")

    def __str__(self):
        return f"{self.user.email} liked {self.recipe.title}"


class RecipeSave(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="saves")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("recipe", "user")

    def __str__(self):
        return f"{self.user.email} saved {self.recipe.title}"

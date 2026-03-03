from django.db import models
from django.utils.text import slugify


class Ingredient(models.Model):
    name = models.CharField(max_length=255, unique=True, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, db_index=True)

    calories = models.FloatField(default=0)
    carbs = models.FloatField(default=0)
    protein = models.FloatField(default=0)
    fat = models.FloatField(default=0)
    fiber = models.FloatField(default=0)

    vitamin_a = models.FloatField(default=0)
    vitamin_c = models.FloatField(default=0)
    calcium = models.FloatField(default=0)
    iron = models.FloatField(default=0)
    potassium = models.FloatField(default=0)

    description = models.TextField(blank=True)
    buy_url = models.URLField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            slug = base
            counter = 1
            while Ingredient.objects.filter(slug=slug).exists():
                slug = f'{base}-{counter}'
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        indexes = [models.Index(fields=['slug'])]


class IngredientMedia(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='media')
    image = models.ImageField(upload_to="ingredients/", blank=True, null=True)
    video_url = models.URLField(blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.ingredient.name} media'


class IngredientBenefit(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='benefits')
    text = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.ingredient.name} benefit'


class IngredientWarning(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='warnings')
    text = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.ingredient.name} warning'


class IngredientGoal(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='goal_links')
    goal = models.ForeignKey('goals.Goal', on_delete=models.CASCADE, related_name='ingredient_links')
    benefit_text = models.CharField(max_length=255)

    class Meta:
        unique_together = ('ingredient', 'goal')

    def __str__(self):
        return f'{self.ingredient.name} for {self.goal.name}'

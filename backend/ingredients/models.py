from django.db import models
from django.utils.text import slugify


class Ingredient(models.Model):

    INGREDIENT_TYPES = [
        ('nuts_and_seeds',          'Nuts & Seeds'),
        ('fruits',                  'Fruits'),
        ('vegetables',              'Leafy Greens & Vegetables'),
        ('meats_and_animal_products', 'Meats & Animal Products'),
        ('grains_and_legumes',      'Grains & Legumes'),
        ('herbs_and_spices',        'Herbs & Spices'),
    ]

    name            = models.CharField(max_length=255, unique=True, db_index=True)
    slug            = models.SlugField(max_length=255, unique=True, blank=True, db_index=True)
    ingredient_type = models.CharField(max_length=50, choices=INGREDIENT_TYPES, db_index=True)

    # Macronutrients (per 100 g)
    calories = models.FloatField(default=0)
    protein  = models.FloatField(default=0)
    carbs    = models.FloatField(default=0)
    fat      = models.FloatField(default=0)
    fiber    = models.FloatField(default=0)

    description = models.TextField(blank=True)
    buy_url     = models.URLField(blank=True)

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


class IngredientVitamin(models.Model):
    """Stores vitamins with their % Daily Value per 100g."""
    ingredient  = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='vitamins')
    name        = models.CharField(max_length=50)   # e.g. "Vitamin C", "B12", "Folate"
    percent_dv  = models.FloatField()               # e.g. 131.0  (from "131%")

    def __str__(self):
        return f'{self.ingredient.name} — {self.name}: {self.percent_dv}%'


class IngredientMineral(models.Model):
    """Stores minerals with their % Daily Value per 100g."""
    ingredient  = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='minerals')
    name        = models.CharField(max_length=50)   # e.g. "Magnesium", "Iron"
    percent_dv  = models.FloatField()               # e.g. 68.0

    def __str__(self):
        return f'{self.ingredient.name} — {self.name}: {self.percent_dv}%'


class IngredientMicronutrient(models.Model):
    """Free-text micronutrients like Curcumin, Omega-3, Beta-glucan etc."""
    ingredient  = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='micronutrients')
    name        = models.CharField(max_length=100)  # e.g. "Curcumin", "Omega-3 (EPA/DHA)"

    def __str__(self):
        return f'{self.ingredient.name} — {self.name}'


class IngredientMedia(models.Model):
    ingredient  = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='media')
    image       = models.ImageField(upload_to='ingredients/', blank=True, null=True)
    video_url   = models.URLField(blank=True)
    is_primary  = models.BooleanField(default=False)
    order       = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.ingredient.name} media'


class IngredientGoal(models.Model):
    ingredient   = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='goal_links')
    goal         = models.ForeignKey('goals.Goal', on_delete=models.CASCADE, related_name='ingredient_links')
    benefit_text = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ('ingredient', 'goal')

    def __str__(self):
        return f'{self.ingredient.name} → {self.goal.name}'

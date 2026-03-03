from django.db import models
from django.utils.text import slugify
from goals.models import Goal
from recipes.models import Recipe


class MealPlan(models.Model):
    goal = models.ForeignKey(Goal, on_delete=models.SET_NULL, null=True, related_name="meal_plans")
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, db_index=True)
    description = models.TextField(blank=True)

    duration_days = models.PositiveIntegerField(default=7)
    meals_per_day = models.PositiveIntegerField(default=3)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            counter = 1
            while MealPlan.objects.filter(slug=slug).exists():
                slug = f"{base}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class MealPlanItem(models.Model):
    MEAL_TYPES = [
        ("breakfast", "Breakfast"),
        ("lunch", "Lunch"),
        ("dinner", "Dinner"),
        ("snack", "Snack"),
    ]

    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE, related_name="items")
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="meal_plan_items")
    day = models.PositiveIntegerField(default=1)
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPES, default="breakfast")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["day", "meal_type", "order"]
        indexes = [models.Index(fields=["meal_plan", "day", "meal_type"])]
        unique_together = ("meal_plan", "day", "meal_type", "recipe")

    def __str__(self):
        return f"{self.meal_plan.title} - Day {self.day} {self.meal_type}"

import os
import sys
import django

BASE_DIR = "/Users/mohantejadharmavarapu/Projects/tejawellness/backend"
sys.path.insert(0, BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "main.settings")
django.setup()


from django.core.management.base import BaseCommand
from recipes.models import Recipe, RecipeIngredient
from recipes.utils import caluclate_recipe_nutrition

class Command(BaseCommand):
    help = "Recalculate nutrition for all recipes"

    def handle(self, *args, **kwargs):
        for recipe in Recipe.objects.all():
            ingredients = RecipeIngredient.objects.filter(recipe=recipe)
            totals = caluclate_recipe_nutrition(ingredients)
            for k, v in totals.items():
                setattr(recipe, k, v)
            recipe.save()
        self.stdout.write(self.style.SUCCESS("Nutrition recalculated"))

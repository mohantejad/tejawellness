import csv
from pathlib import Path
from django.core.management.base import BaseCommand
from recipes.models import Recipe, RecipeIngredient, RecipeMedia
from ingredients.models import Ingredient
from goals.models import Goal
from recipes.utils import caluclate_recipe_nutrition


class Command(BaseCommand):
    help = "Import recipes from CSV and compute nutrition from USDA ingredients"

    def add_arguments(self, parser):
        parser.add_argument("--file", type=str,
                            required=True, help="CSV file path")

    def handle(self, *args, **options):
        csv_path = Path(options["file"])
        if not csv_path.exists():
            self.stderr.write("CSV file not found.")
            return

        created = 0
        updated = 0

        with csv_path.open("r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                goal = None
                if row.get("goal_slug"):
                    goal = Goal.objects.filter(
                        slug=row["goal_slug"].strip()).first()

                recipe, is_created = Recipe.objects.update_or_create(
                    slug=row.get("slug") or None,
                    defaults={
                        "author_id": int(row["author_id"]),
                        "goal": goal,
                        "title": row["title"].strip(),
                        "description": row.get("description", "").strip(),
                        "difficulty": row.get("difficulty", "").strip(),
                        "diet_type": row.get("diet_type", "").strip(),
                        "instructions": row.get("instructions", "").strip(),
                        "meal_type": row.get("meal_type", "").strip(),
                        "meal_time": row.get("meal_time", "").strip(),
                        "prep_time": int(row.get("prep_time") or 0),
                        "cook_time": int(row.get("cook_time") or 0),
                        "servings": int(row.get("servings") or 1),
                        "is_published": True,
                    },
                )

                if is_created:
                    created += 1
                else:
                    updated += 1

                # Ingredients format: ingredient_slug:grams;ingredient_slug:grams
                RecipeIngredient.objects.filter(recipe=recipe).delete()
                ingredients_raw = row.get("ingredients", "")
                items = [i.strip()
                         for i in ingredients_raw.split(";") if i.strip()]
                recipe_ingredients = []
                for item in items:
                    try:
                        slug, grams = item.split(":")
                        ingredient = Ingredient.objects.filter(
                            slug=slug.strip()).first()
                        if not ingredient:
                            continue
                        ri = RecipeIngredient.objects.create(
                            recipe=recipe, ingredient=ingredient, grams=float(
                                grams)
                        )
                        recipe_ingredients.append(ri)
                    except Exception:
                        continue

                # Compute nutrition
                nutrition = caluclate_recipe_nutrition(recipe_ingredients)
                for key, value in nutrition.items():
                    setattr(recipe, key, value)
                recipe.save()

                # Media (optional)
                RecipeMedia.objects.filter(recipe=recipe).delete()
                image_urls = [u.strip() for u in (
                    row.get("image_url") or "").split(";") if u.strip()]
                video_urls = [u.strip() for u in (
                    row.get("video_url") or "").split(";") if u.strip()]

                for idx, img in enumerate(image_urls):
                    RecipeMedia.objects.create(
                        recipe=recipe,
                        image_url=img,
                        is_primary=(idx == 0),
                        order=idx,
                    )

                for idx, vid in enumerate(video_urls):
                    RecipeMedia.objects.create(
                        recipe=recipe,
                        video_url=vid,
                        is_primary=False,
                        order=idx + len(image_urls),
                    )

        self.stdout.write(self.style.SUCCESS(
            f"Imported recipes. Created: {created}, Updated: {updated}"))

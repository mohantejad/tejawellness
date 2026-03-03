import csv
from pathlib import Path
from django.core.management.base import BaseCommand
from ingredients.models import Ingredient

# USDA nutrient IDs we care about
NUTRIENTS = {
    1008: "calories",   # Energy (kcal)
    1003: "protein",    # Protein (g)
    1004: "fat",        # Total lipid (fat) (g)
    1005: "carbs",      # Carbohydrate, by difference (g)
    1079: "fiber",      # Fiber, total dietary (g)
    1106: "vitamin_a",  # Vitamin A, RAE (µg)
    1162: "vitamin_c",  # Vitamin C, total ascorbic acid (mg)
    1087: "calcium",    # Calcium (mg)
    1089: "iron",       # Iron (mg)
    1092: "potassium",  # Potassium (mg)
}

class Command(BaseCommand):
    help = "Import USDA Foundation Foods into Ingredient"

    def add_arguments(self, parser):
        parser.add_argument(
            "--path",
            type=str,
            required=True,
            help="Path to extracted USDA Foundation Foods CSV folder",
        )

    def handle(self, *args, **options):
        base = Path(options["path"])

        food_csv = base / "food.csv"
        food_nutrient_csv = base / "food_nutrient.csv"

        if not food_csv.exists() or not food_nutrient_csv.exists():
            self.stderr.write("Missing food.csv or food_nutrient.csv in given path")
            return

        # Build nutrient map for each food
        nutrients_by_food = {}
        with food_nutrient_csv.open("r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    fdc_id = int(row["fdc_id"])
                    nutrient_id = int(row["nutrient_id"])
                    amount = float(row["amount"]) if row["amount"] else 0.0
                except Exception:
                    continue

                if nutrient_id in NUTRIENTS:
                    nutrients_by_food.setdefault(fdc_id, {})[nutrient_id] = amount

        created = 0
        updated = 0

        with food_csv.open("r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("data_type") != "foundation_food":
                    continue

                name = row["description"].strip().title()
                slug = row["description"].strip().lower().replace(" ", "-")

                nut = nutrients_by_food.get(int(row["fdc_id"]), {})

                defaults = {
                    "name": name,
                    "description": row.get("ingredients", "") or "",
                    "calories": nut.get(1008, 0),
                    "protein": nut.get(1003, 0),
                    "fat": nut.get(1004, 0),
                    "carbs": nut.get(1005, 0),
                    "fiber": nut.get(1079, 0),
                    "vitamin_a": nut.get(1106, 0),
                    "vitamin_c": nut.get(1162, 0),
                    "calcium": nut.get(1087, 0),
                    "iron": nut.get(1089, 0),
                    "potassium": nut.get(1092, 0),
                }

                obj, is_created = Ingredient.objects.update_or_create(
                    slug=slug,
                    defaults=defaults,
                )

                created += 1 if is_created else 0
                updated += 0 if not is_created else 0

        self.stdout.write(self.style.SUCCESS(f"Imported foundation foods. Created: {created}, Updated: {updated}"))

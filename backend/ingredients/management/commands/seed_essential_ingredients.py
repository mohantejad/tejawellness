from django.core.management.base import BaseCommand
from django.utils.text import slugify
from ingredients.models import Ingredient

# Core ingredients used in the seed recipes
INGREDIENT_DATA = [
    {"name": "Chicken Breast", "type": "meats_and_animal_products", "cal": 165, "p": 31, "c": 0, "f": 3.6, "fib": 0},
    {"name": "Almond Milk", "type": "nuts_and_seeds", "cal": 15, "p": 0.5, "c": 0.2, "f": 1.1, "fib": 0.2},
    {"name": "Hemp Seeds", "type": "nuts_and_seeds", "cal": 553, "p": 31.6, "c": 8.7, "f": 48.8, "fib": 4},
    {"name": "Chia Seeds", "type": "nuts_and_seeds", "cal": 486, "p": 16.5, "c": 42.1, "f": 30.7, "fib": 34.4},
    {"name": "Lemon Juice", "type": "fruits", "cal": 22, "p": 0.4, "c": 6.9, "f": 0.2, "fib": 0.3},
    {"name": "Olive Oil", "type": "fats_and_oils", "cal": 884, "p": 0, "c": 0, "f": 100, "fib": 0},
    {"name": "Blueberries Raw", "type": "fruits", "cal": 57, "p": 0.7, "c": 14.5, "f": 0.3, "fib": 2.4},
    {"name": "Strawberries Raw", "type": "fruits", "cal": 32, "p": 0.7, "c": 7.7, "f": 0.3, "fib": 2},
    {"name": "Almonds Raw", "type": "nuts_and_seeds", "cal": 579, "p": 21.2, "c": 21.6, "f": 49.9, "fib": 12.5},
    {"name": "Avocado Fresh", "type": "fruits", "cal": 160, "p": 2, "c": 8.5, "f": 14.7, "fib": 6.7},
    {"name": "Spinach Raw", "type": "vegetables", "cal": 23, "p": 2.9, "c": 3.6, "f": 0.4, "fib": 2.2},
    {"name": "Quinoa Cooked", "type": "grains_and_legumes", "cal": 120, "p": 4.4, "c": 21.3, "f": 1.9, "fib": 2.8},
    {"name": "Cucumber Fresh", "type": "vegetables", "cal": 15, "p": 0.7, "c": 3.6, "f": 0.1, "fib": 0.5},
    {"name": "Tomato Fresh", "type": "vegetables", "cal": 18, "p": 0.9, "c": 3.9, "f": 0.2, "fib": 1.2},
    {"name": "Chickpeas Cooked", "type": "grains_and_legumes", "cal": 164, "p": 8.9, "c": 27.4, "f": 2.6, "fib": 7.6},
    {"name": "Yogurt Plain", "type": "meats_and_animal_products", "cal": 61, "p": 3.5, "c": 4.7, "f": 3.3, "fib": 0},
    {"name": "Flax Seeds", "type": "nuts_and_seeds", "cal": 534, "p": 18.3, "c": 28.9, "f": 42.2, "fib": 27.3},
    {"name": "Raspberries Raw", "type": "fruits", "cal": 52, "p": 1.2, "c": 11.9, "f": 0.7, "fib": 6.5},
    {"name": "Rolled Oats", "type": "grains_and_legumes", "cal": 389, "p": 16.9, "c": 66.3, "f": 6.9, "fib": 10.6},
    {"name": "Whey Protein Isolate", "type": "meats_and_animal_products", "cal": 359, "p": 90, "c": 1, "f": 0.5, "fib": 0},
]

class Command(BaseCommand):
    help = 'Seed basic ingredients for the recipe catalog'

    def handle(self, *args, **options):
        self.stdout.write('Seeding core ingredients...')
        
        for item in INGREDIENT_DATA:
            # We must use slugify manually here to match the slug patterns in recipe_seed.csv
            slug = slugify(item['name'])
            
            # Special case mapping for some slugs to match EXACTLY what's in load_data.py
            # load_data.py uses blueberries-raw (no 's'?), no wait: blueberries-raw
            # Let's check: INGREDIENT_DATABASE = ["blueberries-raw", "strawberries-raw", "almonds-raw"...]
            
            ingredient, created = Ingredient.objects.get_or_create(
                slug=slug,
                defaults={
                    'name': item['name'],
                    'ingredient_type': item['type'],
                    'calories': item['cal'],
                    'protein': item['p'],
                    'carbs': item['c'],
                    'fat': item['f'],
                    'fiber': item['fib'],
                    'description': f'Nutrient-dense {item["name"]} for targeted wellness protocols.'
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created: {item["name"]}'))
            else:
                self.stdout.write(f'Existing: {item["name"]}')

        self.stdout.write(self.style.SUCCESS('Successfully seeded core botanical assets.'))

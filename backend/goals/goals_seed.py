import json
from django.core.management.base import BaseCommand
from goals.models import Goal

class Command(BaseCommand):
    help = "Seed goals from a JSON file"

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            type=str,
            default="seed/goals_seed.json",
            help="Path to JSON file",
        )

    def handle(self, *args, **options):
        path = options["file"]
        with open(path, "r") as f:
            data = json.load(f)

        created = 0
        updated = 0

        for item in data:
            obj, is_created = Goal.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "name": item["name"],
                    "description": item.get("description", ""),
                    # add these if you already added the 4 images
                    # "image_recipes": item.get("image_recipes") or None,
                    # "image_products": item.get("image_products") or None,
                    # "image_workouts": item.get("image_workouts") or None,
                    # "image_articles": item.get("image_articles") or None,
                },
            )
            created += 1 if is_created else 0
            updated += 0 if is_created else 1

        self.stdout.write(self.style.SUCCESS(f"Seeded goals. Created: {created}, Updated: {updated}"))

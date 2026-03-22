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
            # Handle both flat and nested (Django fixture) formats
            fields = item.get("fields", item)
            slug = fields.get("slug") or item.get("slug")
            
            if not slug:
                continue

            obj, is_created = Goal.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": fields["name"],
                    "description": fields.get("description", ""),
                    "image_recipes": fields.get("image_recipes") or None,
                    "image_products": fields.get("image_products") or None,
                    "image_articles": fields.get("image_articles") or None,
                },
            )
            created += 1 if is_created else 0
            updated += 0 if is_created else 1

        self.stdout.write(self.style.SUCCESS(f"Seeded goals. Created: {created}, Updated: {updated}"))

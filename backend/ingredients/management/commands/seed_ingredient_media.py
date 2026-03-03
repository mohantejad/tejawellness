from pathlib import Path

from django.core.management.base import BaseCommand
from django.core.files import File

from ingredients.models import Ingredient, IngredientMedia


class Command(BaseCommand):
    help = "Attach a placeholder image to ingredients with no media."

    def add_arguments(self, parser):
        parser.add_argument(
            "--image",
            type=str,
            default="media/seed/weightloss-recipes.jpg",
            help="Path to placeholder image (relative to backend root).",
        )

    def handle(self, *args, **options):
        backend_root = Path(__file__).resolve().parents[3]
        image_path = backend_root / options["image"]

        if not image_path.exists():
            self.stderr.write(self.style.ERROR(f"Image not found: {image_path}"))
            return

        created = 0
        for ing in Ingredient.objects.all():
            if ing.media.exists():
                continue
            with image_path.open("rb") as f:
                IngredientMedia.objects.create(
                    ingredient=ing,
                    image=File(f, name=image_path.name),
                    is_primary=True,
                    order=0,
                )
                created += 1

        self.stdout.write(self.style.SUCCESS(f"Attached placeholder to {created} ingredients."))

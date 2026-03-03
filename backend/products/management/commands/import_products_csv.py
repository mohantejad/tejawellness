import csv
from decimal import Decimal, InvalidOperation
from pathlib import Path

from django.core.management.base import BaseCommand
from django.core.files import File

from goals.models import Goal
from products.models import Product, ProductMedia


def _parse_bool(val: str) -> bool:
    return str(val).strip().lower() in {"1", "true", "yes", "y"}


class Command(BaseCommand):
    help = "Import products from CSV. Supports multiple images separated by ';'."

    def add_arguments(self, parser):
        parser.add_argument("--file", required=True, help="Path to CSV file")
        parser.add_argument("--images-base", default="", help="Base path for local images (optional)")
        parser.add_argument("--update", action="store_true", help="Update existing products by slug")

    def handle(self, *args, **options):
        csv_path = Path(options["file"]).expanduser()
        if not csv_path.exists():
            self.stderr.write(self.style.ERROR(f"CSV not found: {csv_path}"))
            return

        images_base = Path(options["images_base"]).expanduser() if options["images_base"] else None

        created = 0
        updated = 0

        with csv_path.open("r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                goal_slug = (row.get("goal_slug") or "").strip()
                goal = Goal.objects.filter(slug=goal_slug).first() if goal_slug else None

                stock_raw = (row.get("stock") or "").strip()
                try:
                    stock_val = int(stock_raw) if stock_raw else 0
                except ValueError:
                    stock_val = 0

                price_raw = (row.get("price") or "").strip()
                compare_raw = (row.get("compare_at_price") or "").strip()
                try:
                    price_val = Decimal(price_raw) if price_raw else Decimal("0")
                except InvalidOperation:
                    self.stdout.write(self.style.WARNING(
                        f"Skipping row (bad price): {row}"
                    ))
                    continue
                try:
                    compare_val = Decimal(compare_raw) if compare_raw else None
                except InvalidOperation:
                    compare_val = None

                data = {
                    "name": row.get("name", "").strip(),
                    "description": row.get("description", "").strip(),
                    "price": price_val,
                    "compare_at_price": compare_val,
                    "affiliate_url": row.get("affiliate_url", "").strip(),
                    "stock": stock_val,
                    "is_active": _parse_bool(row.get("is_active", "true")),
                    "goal": goal,
                }

                slug = (row.get("slug") or "").strip()

                if slug and options["update"]:
                    product, was_created = Product.objects.update_or_create(
                        slug=slug,
                        defaults=data,
                    )
                else:
                    product = Product.objects.create(**data)
                    was_created = True

                if was_created:
                    created += 1
                else:
                    updated += 1

                # Handle images / media
                images = [s.strip() for s in (row.get("images") or "").split(";") if s.strip()]
                video = (row.get("video") or "").strip()

                if images:
                    for idx, img in enumerate(images):
                        image_path = Path(img)
                        if not image_path.is_absolute() and images_base:
                            image_path = images_base / image_path
                        if image_path.exists():
                            with image_path.open("rb") as fp:
                                ProductMedia.objects.create(
                                    product=product,
                                    image=File(fp, name=image_path.name),
                                    is_primary=(idx == 0),
                                    order=idx,
                                )
                        else:
                            # If image is URL (http), skip file attachment, leave media empty
                            # You can store URLs directly in Product.image_url if needed.
                            pass

                    # set product.image_url to first image if local
                    if images:
                        first = images[0]
                        image_path = Path(first)
                        if not image_path.is_absolute() and images_base:
                            image_path = images_base / image_path
                        if image_path.exists():
                            with image_path.open("rb") as fp:
                                product.image_url.save(image_path.name, File(fp), save=True)

                if video:
                    video_path = Path(video)
                    if not video_path.is_absolute() and images_base:
                        video_path = images_base / video_path
                    if video_path.exists():
                        with video_path.open("rb") as fp:
                            ProductMedia.objects.create(
                                product=product,
                                video_url=File(fp, name=video_path.name),
                                is_primary=False,
                                order=999,
                            )

        self.stdout.write(self.style.SUCCESS(f"Products created: {created}, updated: {updated}"))

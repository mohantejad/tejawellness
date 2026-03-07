"""
Management command: import_ingredients
Imports ingredients from an Excel workbook (Ingredients_v2.xlsx) into the DB.

Usage:
    python manage.py import_ingredients
    python manage.py import_ingredients --path data/Ingredients_v2.xlsx
    python manage.py import_ingredients --clear   (wipes existing data first)
"""

import re
from pathlib import Path

from django.core.management.base import BaseCommand

from goals.models import Goal
from ingredients.models import (
    Ingredient,
    IngredientGoal,
    IngredientMineral,
    IngredientMicronutrient,
    IngredientVitamin,
)

try:
    import openpyxl
except ImportError:
    openpyxl = None  # type: ignore

# ── Sheet name → ingredient_type choice value ─────────────────────────────────
SHEET_TO_TYPE = {
    'Nuts & Seeds':                'nuts_and_seeds',
    'Fruits':                      'fruits',
    'Leafy Greens & Vegetables':   'vegetables',
    'Meats & Animal Products':     'meats_and_animal_products',
    'Grains & Legumes':            'grains_and_legumes',
    'Herbs & Spices':              'herbs_and_spices',
}

# ── Column indices (0-based) ──────────────────────────────────────────────────
COL_NAME         = 0
COL_CALORIES     = 1
COL_MACROS       = 2
COL_VITAMINS     = 3
COL_MINERALS     = 4
COL_MICRO        = 5
COL_GOALS        = 6


def _parse_macros(text: str | None) -> dict:
    """Extract float values for protein/carbs/fat/fiber from free text."""
    result = {'protein': 0.0, 'carbs': 0.0, 'fat': 0.0, 'fiber': 0.0}
    if not text:
        return result
    for key in result:
        m = re.search(rf'{key}[\s:]+([0-9.]+)', text, re.IGNORECASE)
        if m:
            result[key] = float(m.group(1))
    return result


def _parse_percent_items(text: str | None) -> list[tuple[str, float]]:
    """
    Parse strings like 'E: 131%, B2: 60%' or 'Mg: 68%, Ca: 27%'
    Returns a list of (name, percent_dv) tuples.
    """
    if not text:
        return []
    items = []
    # Split on comma, then parse each 'Name: VALUE%' pair
    for chunk in text.split(','):
        chunk = chunk.strip()
        m = re.match(r'^(.+?):\s*([0-9.]+)%', chunk)
        if m:
            name = m.group(1).strip()
            pct  = float(m.group(2))
            items.append((name, pct))
    return items


def _parse_micronutrients(text: str | None) -> list[str]:
    """Split comma-separated micronutrient names."""
    if not text:
        return []
    return [n.strip() for n in text.split(',') if n.strip()]


class Command(BaseCommand):
    help = 'Import ingredients from Excel workbook into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--path',
            type=str,
            default='data/Ingredients_v2.xlsx',
            help='Path to the Excel workbook (default: data/Ingredients_v2.xlsx)',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Delete ALL existing ingredients before importing',
        )

    def handle(self, *args, **options):
        if openpyxl is None:
            self.stderr.write('openpyxl is not installed. Run: pip install openpyxl')
            return

        path = Path(options['path'])
        if not path.exists():
            self.stderr.write(f'File not found: {path}')
            return

        # ── Optional clear ────────────────────────────────────────────────────
        if options['clear']:
            count, _ = Ingredient.objects.all().delete()
            self.stdout.write(self.style.WARNING(f'Cleared {count} existing ingredients.'))

        # ── Pre-load goals into a dict for fast lookup ────────────────────────
        goal_map: dict[str, Goal] = {g.name: g for g in Goal.objects.all()}
        self.stdout.write(f'Found {len(goal_map)} goals in DB: {list(goal_map.keys())}')

        # ── Open workbook ─────────────────────────────────────────────────────
        wb = openpyxl.load_workbook(path, read_only=True, data_only=True)

        created_total  = 0
        updated_total  = 0
        skipped_total  = 0
        unknown_goals  = set()

        for sheet_name in wb.sheetnames:
            ingredient_type = SHEET_TO_TYPE.get(sheet_name)
            if ingredient_type is None:
                self.stdout.write(self.style.WARNING(
                    f'Skipping unknown sheet: {sheet_name}'
                ))
                continue

            ws   = wb[sheet_name]
            rows = list(ws.iter_rows(values_only=True))
            data_rows = rows[1:]  # skip header

            sheet_created = 0
            sheet_updated = 0

            for row in data_rows:
                name = row[COL_NAME]
                if not name:
                    continue
                name = str(name).strip()

                # ── Calories ─────────────────────────────────────────────────
                try:
                    calories = float(row[COL_CALORIES]) if row[COL_CALORIES] else 0.0
                except (TypeError, ValueError):
                    calories = 0.0

                # ── Macros ───────────────────────────────────────────────────
                macros = _parse_macros(str(row[COL_MACROS]) if row[COL_MACROS] else '')

                # ── Create / update Ingredient ────────────────────────────────
                ingredient, is_new = Ingredient.objects.update_or_create(
                    name=name,
                    defaults={
                        'ingredient_type': ingredient_type,
                        'calories':        calories,
                        'protein':         macros['protein'],
                        'carbs':           macros['carbs'],
                        'fat':             macros['fat'],
                        'fiber':           macros['fiber'],
                    },
                )

                if is_new:
                    sheet_created += 1
                else:
                    sheet_updated += 1

                # ── Vitamins ─────────────────────────────────────────────────
                ingredient.vitamins.all().delete()
                for vname, pct in _parse_percent_items(str(row[COL_VITAMINS]) if row[COL_VITAMINS] else ''):
                    IngredientVitamin.objects.create(
                        ingredient=ingredient,
                        name=vname,
                        percent_dv=pct,
                    )

                # ── Minerals ─────────────────────────────────────────────────
                ingredient.minerals.all().delete()
                for mname, pct in _parse_percent_items(str(row[COL_MINERALS]) if row[COL_MINERALS] else ''):
                    IngredientMineral.objects.create(
                        ingredient=ingredient,
                        name=mname,
                        percent_dv=pct,
                    )

                # ── Micronutrients ───────────────────────────────────────────
                ingredient.micronutrients.all().delete()
                for micro_name in _parse_micronutrients(str(row[COL_MICRO]) if row[COL_MICRO] else ''):
                    IngredientMicronutrient.objects.create(
                        ingredient=ingredient,
                        name=micro_name,
                    )

                # ── Goal links ───────────────────────────────────────────────
                ingredient.goal_links.all().delete()
                if row[COL_GOALS]:
                    for goal_name in str(row[COL_GOALS]).split(','):
                        goal_name = goal_name.strip()
                        goal = goal_map.get(goal_name)
                        if goal:
                            IngredientGoal.objects.get_or_create(
                                ingredient=ingredient,
                                goal=goal,
                            )
                        else:
                            unknown_goals.add(goal_name)

            created_total += sheet_created
            updated_total += sheet_updated
            self.stdout.write(
                f'  [{sheet_name}] created: {sheet_created}, updated: {sheet_updated}'
            )

        wb.close()

        # ── Summary ───────────────────────────────────────────────────────────
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Done! Created: {created_total}, Updated: {updated_total}, Skipped: {skipped_total}'
        ))

        if unknown_goals:
            self.stdout.write(self.style.WARNING(
                f'These goal names were NOT found in DB: {sorted(unknown_goals)}'
            ))
            self.stdout.write(
                'Tip: Goal names in the Excel must match the DB exactly (case-sensitive).'
            )

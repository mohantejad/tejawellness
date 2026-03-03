import random

from django.core.management.base import BaseCommand
from django.db import transaction

from goals.models import Goal
from recipes.models import Recipe
from meal_plans.models import MealPlan, MealPlanItem


PRIORITY_SLUGS = [
    "skin-care",
    "hair-care",
    "weight-loss",
    "lean-body-recomposition",
    "gut-health",
    "stress-relief",
    "better-sleep",
    "anti-inflammation",
    "hormone-balance",
    "immunity",
    "energy-boost",
    "healthy-aging-longevity",
]

MEAL_TYPES = ["breakfast", "lunch", "dinner"]


class Command(BaseCommand):
    help = "Seed 7-day meal plans for priority goals using existing recipes."

    def add_arguments(self, parser):
        parser.add_argument("--days", type=int, default=7)
        parser.add_argument("--meals", type=int, default=3)
        parser.add_argument("--replace", action="store_true", help="Delete existing plans for these goals")

    def handle(self, *args, **options):
        days = options["days"]
        meals = options["meals"]
        replace = options["replace"]

        random.seed(42)

        goals = Goal.objects.filter(slug__in=PRIORITY_SLUGS)

        if replace:
            MealPlan.objects.filter(goal__in=goals).delete()

        created = 0
        skipped = 0

        for goal in goals:
            recipes = Recipe.objects.filter(goal=goal, is_published=True)
            if not recipes.exists():
                self.stdout.write(self.style.WARNING(f"No recipes for {goal.slug}, skipping"))
                skipped += 1
                continue

            title = f"{goal.name} 7-Day Meal Plan"
            plan, plan_created = MealPlan.objects.get_or_create(
                goal=goal,
                title=title,
                defaults={
                    "description": f"A 7-day meal plan to support {goal.name.lower()}.",
                    "duration_days": days,
                    "meals_per_day": meals,
                    "is_published": True,
                },
            )

            if not plan_created:
                skipped += 1
                continue

            with transaction.atomic():
                for day in range(1, days + 1):
                    for idx, meal_type in enumerate(MEAL_TYPES[:meals]):
                        candidates = recipes.filter(meal_type=meal_type)
                        recipe = random.choice(list(candidates)) if candidates.exists() else random.choice(list(recipes))
                        MealPlanItem.objects.create(
                            meal_plan=plan,
                            recipe=recipe,
                            day=day,
                            meal_type=meal_type,
                            order=idx,
                        )

            created += 1

        self.stdout.write(self.style.SUCCESS(f"Meal plans created: {created}, skipped: {skipped}"))

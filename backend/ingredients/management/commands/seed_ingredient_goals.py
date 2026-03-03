from django.core.management.base import BaseCommand
from ingredients.models import Ingredient, IngredientGoal
from goals.models import Goal

SEED = [
    # goal_slug, name_contains, benefit_text
    ("skin-care", "blueberr", "Rich in antioxidants to protect skin from oxidative stress."),
    ("skin-care", "strawberr", "Vitamin C supports collagen production."),
    ("skin-care", "avocado", "Healthy fats improve skin hydration and elasticity."),
    ("skin-care", "almond", "Vitamin E supports skin barrier repair."),
    ("skin-care", "flax", "Omega-3s help calm skin inflammation."),

    ("hair-care", "egg", "Biotin and protein support hair strength."),
    ("hair-care", "spinach", "Iron and folate support hair growth."),
    ("hair-care", "salmon", "Omega-3s reduce scalp inflammation."),
    ("hair-care", "pumpkin seed", "Zinc supports healthy hair follicles."),

    ("weight-loss", "oat", "High fiber increases fullness and controls appetite."),
    ("weight-loss", "chickpea", "Protein + fiber combo improves satiety."),
    ("weight-loss", "yogurt", "High protein helps preserve lean mass."),

    ("gut-health", "yogurt", "Probiotics support healthy gut bacteria."),
    ("gut-health", "kefir", "Fermented dairy for gut microbiome support."),
    ("gut-health", "banana", "Prebiotic fiber feeds good bacteria."),

    ("energy-boost", "sweet potato", "Complex carbs for steady energy."),
    ("energy-boost", "quinoa", "Complete protein + slow-digesting carbs."),
    ("energy-boost", "spinach", "Iron helps reduce fatigue."),

    ("anti-inflammation", "turmeric", "Curcumin has anti-inflammatory properties."),
    ("anti-inflammation", "olive oil", "Oleic acid supports inflammation reduction."),
    ("anti-inflammation", "salmon", "Omega-3s reduce inflammatory markers."),

    ("immunity", "orange", "Vitamin C supports immune defense."),
    ("immunity", "garlic", "Allicin supports immune function."),
    ("immunity", "spinach", "Micronutrients strengthen immune response."),
]

class Command(BaseCommand):
    help = "Seed IngredientGoal links with benefit text using name match."

    def handle(self, *args, **options):
        created = 0
        updated = 0
        skipped = 0

        for goal_slug, name_contains, benefit_text in SEED:
            try:
                goal = Goal.objects.get(slug=goal_slug)
            except Goal.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"Goal not found: {goal_slug}"))
                skipped += 1
                continue

            qs = Ingredient.objects.filter(name__icontains=name_contains).order_by("name")
            ingredient = qs.first()

            if not ingredient:
                self.stdout.write(self.style.WARNING(f"No ingredient match for: {name_contains}"))
                skipped += 1
                continue

            obj, was_created = IngredientGoal.objects.get_or_create(
                goal=goal,
                ingredient=ingredient,
                defaults={"benefit_text": benefit_text},
            )
            if was_created:
                created += 1
            else:
                obj.benefit_text = benefit_text
                obj.save(update_fields=["benefit_text"])
                updated += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f"{goal_slug} -> {ingredient.name} ({ingredient.slug})"
                )
            )

        self.stdout.write(self.style.SUCCESS(
            f"Seed done. Created: {created}, Updated: {updated}, Skipped: {skipped}"
        ))

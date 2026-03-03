import csv
import random

# Priority goals
PRIORITY_SLUGS = [
    "skin-care", "hair-care", "weight-loss", "lean-body-recomposition",
    "gut-health", "stress-relief", "better-sleep", "anti-inflammation",
    "hormone-balance", "immunity", "energy-boost", "healthy-aging-longevity"
]

# All goals
ALL_GOALS = [
    "weight-loss","fat-loss","lean-body-recomposition","healthy-weight-gain","muscle-gain",
    "toning-definition","strength-power","athletic-performance","endurance-stamina","speed-agility",
    "balance-coordination","core-strength","functional-fitness","mobility-flexibility","posture-alignment",
    "recovery-injury-prevention","joint-health","back-pain-relief","energy-boost","stress-relief",
    "better-sleep","focus-mental-clarity","heart-health","blood-pressure-support","circulation-support",
    "metabolic-health","blood-sugar-balance","insulin-sensitivity","hormone-balance","thyroid-support",
    "gut-health","digestion-support","bloating-relief","immunity","anti-inflammation","seasonal-wellness",
    "skin-care","hair-care","nail-health","healthy-aging-longevity","detox-clean-living","healthy-habits"
]

# Ingredient slugs (must match DB exactly)
INGREDIENT_DATABASE = [
    "chicken-breast", "almond-milk", "hemp-seeds", "chia-seeds",
    "lemon-juice", "olive-oil", "blueberries-raw", "strawberries-raw",
    "almonds-raw", "avocado-fresh", "spinach-raw", "quinoa-cooked",
    "cucumber-fresh", "tomato-fresh", "chickpeas-cooked", "yogurt-plain",
    "flax-seeds", "raspberries-raw", "rolled-oats", "whey-protein-isolate"
]

MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"]
MEAL_TIMES = ["morning", "noon", "evening", "post-workout"]
DIET_TYPES = ["balanced", "high-protein", "vegan", "paleo"]

random.seed(42)

def make_ingredients():
    count = random.randint(3, 5)
    picks = random.sample(INGREDIENT_DATABASE, count)
    parts = []
    for slug in picks:
        grams = random.randint(30, 200)
        parts.append(f"{slug}:{grams}")
    return ";".join(parts)

def generate_csv(filename="recipe_seed.csv"):
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "author_id","goal_slug","title","description","difficulty","diet_type",
            "meal_type","meal_time","prep_time","cook_time","servings",
            "instructions","ingredients","image_url","video_url"
        ])
        writer.writeheader()

        for slug in ALL_GOALS:
            count = 15 if slug in PRIORITY_SLUGS else 6
            for i in range(1, count + 1):
                writer.writerow({
                    "author_id": 1,
                    "goal_slug": slug,
                    "title": f"Wellness Boost {i} for {slug.replace('-', ' ').title()}",
                    "description": f"A healthy recipe designed to support {slug.replace('-', ' ')}.",
                    "difficulty": random.choice(["easy","medium"]),
                    "diet_type": random.choice(DIET_TYPES),
                    "meal_type": random.choice(MEAL_TYPES),
                    "meal_time": random.choice(MEAL_TIMES),
                    "prep_time": random.randint(5, 20),
                    "cook_time": random.randint(0, 25),
                    "servings": random.randint(1, 3),
                    "instructions": "1. Prepare ingredients. 2. Combine and serve.",
                    "ingredients": make_ingredients(),
                    "image_url": "seed/weightloss-recipes.jpg;seed/weightloss-products.jpg;seed/weightloss-workouts.jpg",
                    "video_url": ""
                })

    print(f"{filename} created successfully.")

generate_csv()

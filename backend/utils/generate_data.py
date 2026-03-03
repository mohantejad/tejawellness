from __future__ import annotations
import json
import random
from datetime import datetime, timezone
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

GOALS = [
    ('Weight Loss', 'Sustainable fat loss and energy balance.'),
    ('Muscle Gain', 'Build lean muscle with strength-focused nutrition.'),
    ('Gut Health', 'Support digestion and microbiome balance.'),
    ('Skin Care', 'Nourish skin with nutrient‑dense foods.'),
    ('Hair Care', 'Promote hair strength and growth.'),
    ('Heart Health', 'Support cardiovascular wellness.'),
    ('Stress Relief', 'Balance mood and reduce stress.'),
    ('Energy Boost', 'Increase daily energy and focus.'),
    ('Immunity', 'Strengthen immune defenses.'),
    ('Sleep Better', 'Improve sleep quality and recovery.'),
]

INGREDIENTS = [
    ('Spinach', 'Leafy green rich in iron and vitamins.'),
    ('Salmon', 'Omega‑3 rich fatty fish.'),
    ('Greek Yogurt', 'High‑protein probiotic dairy.'),
    ('Almonds', 'Healthy fats and vitamin E.'),
    ('Blueberries', 'Antioxidant‑rich berries.'),
    ('Oats', 'Whole‑grain fiber source.'),
    ('Eggs', 'Complete protein source.'),
    ('Avocado', 'Healthy fats and potassium.'),
    ('Chickpeas', 'Plant protein and fiber.'),
    ('Sweet Potato', 'Complex carbs and vitamin A.'),
]

RECIPE_TITLES = [
    'High‑Protein Breakfast Bowl',
    'Green Detox Smoothie',
    'Salmon & Quinoa Plate',
    'Overnight Oats with Berries',
    'Chickpea Power Salad',
    'Avocado Toast Upgrade',
    'Greek Yogurt Parfait',
    'Lean Chicken Stir‑Fry',
    'Sweet Potato Fuel Bowl',
    'Spinach & Egg Scramble',
    'Mediterranean Veggie Wrap',
    'Berry Recovery Smoothie',
    'Oatmeal Energy Cups',
    'Protein Pancakes',
    'Gut‑Friendly Soup',
    'Omega‑3 Salad',
    'Skin Glow Salad',
    'Muscle Gain Meal Prep',
    'Low‑GI Lunch Bowl',
    'Evening Calm Tea',
    'Hair Strength Smoothie',
    'Heart‑Healthy Bowl',
    'Immunity Boost Stew',
    'Energy Booster Shake',
    'Sleep Support Snack',
]

PRODUCTS = [
    ('Vitamin D3 Softgels', 'Daily vitamin D support.'),
    ('Omega‑3 Fish Oil', 'Heart and brain support.'),
    ('Magnesium Glycinate', 'Relaxation and sleep support.'),
    ('Collagen Peptides', 'Skin and joint support.'),
    ('Biotin Gummies', 'Hair and nail support.'),
    ('Probiotic Capsules', 'Gut health support.'),
    ('Electrolyte Powder', 'Hydration and recovery.'),
    ('Whey Protein', 'Muscle recovery and growth.'),
    ('Plant Protein Blend', 'Vegan protein support.'),
    ('Green Superfood Powder', 'Daily micronutrient boost.'),
    ('Zinc Tablets', 'Immunity support.'),
    ('Ashwagandha Capsules', 'Stress support.'),
    ('Creatine Monohydrate', 'Performance support.'),
    ('Vitamin C', 'Antioxidant support.'),
    ('Multivitamin', 'Daily wellness support.'),
]

WORKOUTS = [
    ('30‑Min Fat Burn Circuit', 'Full body fat‑burning circuit.'),
    ('Upper Body Strength', 'Push/pull strength workout.'),
    ('Lower Body Builder', 'Glutes and legs focused training.'),
    ('Core Stability Flow', 'Core endurance and balance.'),
    ('20‑Min HIIT Blast', 'Short, high‑intensity intervals.'),
    ('Yoga for Recovery', 'Gentle recovery and mobility.'),
    ('Mobility Reset', 'Improve joint range of motion.'),
    ('Full Body Dumbbell', 'Strength workout with dumbbells.'),
    ('Low‑Impact Cardio', 'Joint‑friendly cardio.'),
    ('Stretch & Relax', 'End‑of‑day stretch.'),
    ('Strength Foundations', 'Beginner strength circuit.'),
    ('Glute Activation', 'Lower body activation.'),
    ('Posture Fix', 'Upper back and posture work.'),
    ('Endurance Builder', 'Steady‑state cardio.'),
    ('Speed & Agility', 'Agility drills and speed work.'),
    ('Pilates Core', 'Core and stability focus.'),
    ('Bodyweight Burn', 'No‑equipment workout.'),
    ('HIIT + Core', 'Intervals + core finisher.'),
    ('Upper Body Pump', 'Hypertrophy focus.'),
    ('Legs + Core', 'Strength and stability.'),
]

ARTICLES = [
    ('The Basics of Macronutrients', 'A quick guide to carbs, protein, and fat.'),
    ('How to Build a Balanced Plate', 'Simple rules for meal balance.'),
    ('Best Foods for Skin Health', 'Nutrients that support skin glow.'),
    ('Gut Health 101', 'Your microbiome and digestion.'),
    ('Hydration Tips for Energy', 'Why water matters for performance.'),
    ('Protein Timing Myths', 'What the science actually says.'),
    ('Stress and Sleep Connection', 'How stress impacts rest.'),
    ('Meal Prep for Beginners', 'Easy ways to start.'),
    ('How to Read Nutrition Labels', 'Simple label skills.'),
    ('Supplements: What’s Worth It?', 'Evidence‑based supplements.'),
    ('Fiber and Digestion', 'Why fiber is key.'),
    ('Healthy Snacking Ideas', 'Quick snacks with value.'),
    ('Hair Growth Nutrition', 'Nutrients that matter.'),
    ('Strength Training for Beginners', 'Start smart.'),
    ('Cardio vs Strength', 'Which should you pick?'),
    ('Sleep Hygiene Checklist', 'Better sleep habits.'),
    ('Anti‑Inflammatory Foods', 'Foods that help recovery.'),
    ('Post‑Workout Nutrition', 'What to eat after training.'),
    ('Mindful Eating Tips', 'Reduce overeating.'),
    ('Immunity Support Basics', 'Daily habits that help.'),
    ('Caffeine and Energy', 'Using caffeine wisely.'),
    ('Building Healthy Habits', 'Small changes, big results.'),
]


def slugify(text: str) -> str:
    return text.lower().replace('‑', '-').replace(' ', '-').replace('/', '').replace('&', 'and')


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def write_fixture(path: Path, data: list[dict]):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding='utf-8')


def main():
    random.seed(42)

    # Goals
    goal_data = []
    for i, (name, desc) in enumerate(GOALS, start=1):
        goal_data.append({
            'model': 'goals.goal',
            'pk': i,
            'fields': {
                'name': name,
                'slug': slugify(name),
                'description': desc,
                'image_url': f'https://example.com/images/goals/{i}.jpg',
            }
        })
    write_fixture(BASE_DIR / 'data/goals.json', goal_data)

    # Ingredients (50)
    ingredient_data = []
    for i in range(1, 51):
        base = INGREDIENTS[i % len(INGREDIENTS)]
        name = f'{base[0]} {i}'
        ingredient_data.append({
            'model': 'ingredients.ingredient',
            'pk': i,
            'fields': {
                'name': name,
                'slug': slugify(name),
                'calories': random.randint(10, 200),
                'carbs': random.randint(1, 40),
                'protein': random.randint(1, 30),
                'fat': random.randint(0, 20),
                'fiber': random.randint(0, 10),
                'vitamin_a': random.randint(0, 50),
                'vitamin_c': random.randint(0, 50),
                'calcium': random.randint(0, 50),
                'iron': random.randint(0, 50),
                'potassium': random.randint(0, 50),
                'description': base[1],
            }
        })
    write_fixture(BASE_DIR / 'data/ingredients.json', ingredient_data)

    # Recipes (25)
    recipe_data = []
    for i in range(1, 26):
        title = RECIPE_TITLES[i - 1]
        recipe_data.append({
            'model': 'recipes.recipe',
            'pk': i,
            'fields': {
                'author': 1,  # assumes superuser with pk=1
                'goal': random.randint(1, len(GOALS)),
                'title': title,
                'slug': slugify(title),
                'description': f'{title} with balanced macros and simple prep.',
                'prep_time': random.randint(5, 20),
                'cook_time': random.randint(5, 30),
                'servings': random.randint(1, 4),
                'calories': random.randint(200, 600),
                'protein': random.randint(10, 50),
                'carbs': random.randint(10, 70),
                'fat': random.randint(5, 30),
                'fiber': random.randint(0, 10),
                'vitamin_a': random.randint(0, 50),
                'vitamin_c': random.randint(0, 50),
                'iron': random.randint(0, 50),
                'calcium': random.randint(0, 50),
                'potassium': random.randint(0, 50),
                'is_published': True,
                'created_at': now_iso(),
                'updated_at': now_iso(),
                'average_rating': 0,
                'rating_count': 0,
            }
        })
    write_fixture(BASE_DIR / 'data/recipes.json', recipe_data)

    # Products (15)
    product_data = []
    for i in range(1, 16):
        name, desc = PRODUCTS[i - 1]
        product_data.append({
            'model': 'products.product',
            'pk': i,
            'fields': {
                'name': name,
                'slug': slugify(name),
                'description': desc,
                'goal': random.randint(1, len(GOALS)),
                'price': str(random.randint(10, 60)),
                'compare_at_price': None,
                'image_url': f'https://example.com/images/products/{i}.jpg',
                'is_active': True,
                'stock': random.randint(10, 200),
                'average_rating': 0,
                'rating_count': 0,
                'created_at': now_iso(),
            }
        })
    write_fixture(BASE_DIR / 'data/products.json', product_data)

    # Workouts (20)
    workout_data = []
    for i in range(1, 21):
        title, desc = WORKOUTS[i - 1]
        workout_data.append({
            'model': 'workouts.workout',
            'pk': i,
            'fields': {
                'title': title,
                'slug': slugify(title),
                'description': desc,
                'goal': random.randint(1, len(GOALS)),
                'duration_minutes': random.randint(10, 60),
                'difficulty': random.choice(['Beginner', 'Intermediate', 'Advanced']),
                'equipment': random.choice(['None', 'Dumbbells', 'Band', 'Kettlebell']),
                'is_published': True,
                'average_rating': 0,
                'rating_count': 0,
                'created_at': now_iso(),
                'updated_at': now_iso(),
            }
        })
    write_fixture(BASE_DIR / 'data/workouts.json', workout_data)

    # Articles (22)
    article_data = []
    for i in range(1, 23):
        title, summary = ARTICLES[i - 1]
        article_data.append({
            'model': 'articles.article',
            'pk': i,
            'fields': {
                'title': title,
                'slug': slugify(title),
                'summary': summary,
                'content': f'{summary}\n\nThis article provides practical, evidence‑based guidance and simple steps.',
                'goal': random.randint(1, len(GOALS)),
                'image_url': f'https://example.com/images/articles/{i}.jpg',
                'source_url': f'https://example.com/articles/{i}',
                'is_published': True,
                'average_rating': 0,
                'rating_count': 0,
                'created_at': now_iso(),
                'updated_at': now_iso(),
            }
        })
    write_fixture(BASE_DIR / 'data/articles.json', article_data)


if __name__ == '__main__':
    main()

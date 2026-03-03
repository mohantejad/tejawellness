from django.db.models import Avg, Count


def caluclate_recipe_nutrition(recipe_ingredients):
    totals = {
        'calories': 0,
        'protein': 0,
        'carbs': 0,
        'fat': 0,
        'fiber': 0,
        'vitamin_a': 0,
        'vitamin_c': 0,
        'iron': 0,
        'calcium': 0,
        'potassium': 0,
    }

    for ri in recipe_ingredients:
        ing = ri.ingredient
        factor = ri.grams / 100

        totals['calories'] += ing.calories * factor
        totals['protein'] += ing.protein * factor
        totals['carbs'] += ing.carbs * factor
        totals['fat'] += ing.fat * factor
        totals['fiber'] += ing.fiber * factor
        totals['vitamin_a'] += ing.vitamin_a * factor
        totals['vitamin_c'] += ing.vitamin_c * factor
        totals['iron'] += ing.iron * factor
        totals['calcium'] += ing.calcium * factor
        totals['potassium'] += ing.potassium * factor   

    return totals

def update_recipe_rating(recipe):
    agg = recipe.reviews.aggregate(avg=Avg('rating'), count=Count('id'))
    recipe.average_rating = agg["avg"] or 0
    recipe.rating_count = agg["count"] or 0
    recipe.save()
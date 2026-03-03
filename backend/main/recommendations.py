from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q

from goals.models import Goal
from recipes.models import Recipe, RecipeLike, RecipeSave, RecipeReview, RecipeComment
from products.models import Product, ProductLike, ProductReview, ProductComment
from meal_plans.models import MealPlan


# ---------- helpers ----------

def score_goals_for_user(user):
    """
    Returns dict {goal_id: score}
    Weights:
      like = +3
      save = +4
      review = +2
      comment = +1
    """
    scores = {}

    def add_score(goal_id, points):
        if not goal_id:
            return
        scores[goal_id] = scores.get(goal_id, 0) + points

    # Recipes
    for g in RecipeLike.objects.filter(user=user).values_list("recipe__goal_id", flat=True):
        add_score(g, 3)
    for g in RecipeSave.objects.filter(user=user).values_list("recipe__goal_id", flat=True):
        add_score(g, 4)
    for g in RecipeReview.objects.filter(user=user).values_list("recipe__goal_id", flat=True):
        add_score(g, 2)
    for g in RecipeComment.objects.filter(user=user).values_list("recipe__goal_id", flat=True):
        add_score(g, 1)

    # Products
    for g in ProductLike.objects.filter(user=user).values_list("product__goal_id", flat=True):
        add_score(g, 3)
    for g in ProductReview.objects.filter(user=user).values_list("product__goal_id", flat=True):
        add_score(g, 2)
    for g in ProductComment.objects.filter(user=user).values_list("product__goal_id", flat=True):
        add_score(g, 1)

    return scores


def recommend_by_goal(model_qs, goal_scores, limit=8):
    # rank by score, fallback to newest
    scored = []
    for item in model_qs:
        score = goal_scores.get(item.goal_id, 0)
        scored.append((score, item))
    scored.sort(key=lambda x: (x[0], x[1].id), reverse=True)
    return [x[1] for x in scored[:limit]]


# ---------- endpoints ----------

class RecommendedGoalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        scores = score_goals_for_user(request.user)
        goals = list(Goal.objects.all())

        goals.sort(key=lambda g: scores.get(g.id, 0), reverse=True)

        return Response([
            {"id": g.id, "name": g.name, "slug": g.slug, "description": g.description}
            for g in goals
        ])


class RecommendationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        scores = score_goals_for_user(request.user)

        recipes = recommend_by_goal(
            Recipe.objects.filter(is_published=True),
            scores,
            limit=4
        )
        products = recommend_by_goal(
            Product.objects.filter(is_active=True),
            scores,
            limit=4
        )
        meal_plans = recommend_by_goal(
            MealPlan.objects.filter(is_published=True),
            scores,
            limit=4
        )

        mixed = []

        for r in recipes:
            mixed.append({"type": "recipe", "id": r.id, "title": r.title, "goal": r.goal.slug})
        for p in products:
            mixed.append({"type": "product", "id": p.id, "title": p.name, "goal": p.goal.slug})
        for m in meal_plans:
            mixed.append({"type": "meal_plan", "id": m.id, "title": m.title, "goal": m.goal.slug if m.goal else ""})

        return Response(mixed)


class RecommendedRecipesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        scores = score_goals_for_user(request.user)
        recipes = recommend_by_goal(
            Recipe.objects.filter(is_published=True),
            scores,
            limit=12
        )
        return Response([{"id": r.id, "title": r.title, "goal": r.goal.slug} for r in recipes])


class RecommendedProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        scores = score_goals_for_user(request.user)
        products = recommend_by_goal(
            Product.objects.filter(is_active=True),
            scores,
            limit=12
        )
        return Response([{"id": p.id, "title": p.name, "goal": p.goal.slug} for p in products])


class RecommendedMealPlansView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        scores = score_goals_for_user(request.user)
        plans = recommend_by_goal(
            MealPlan.objects.filter(is_published=True),
            scores,
            limit=12
        )
        return Response([{"id": m.id, "title": m.title, "goal": m.goal.slug if m.goal else ""} for m in plans])

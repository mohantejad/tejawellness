from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from goals.models import Goal
from recipes.models import Recipe, RecipeLike, RecipeSave, RecipeReview, RecipeComment
from products.models import Product, ProductLike, ProductReview, ProductComment
from meal_plans.models import MealPlan
from rag.models import Embedding
from rag.embenddings import get_embedding
from pgvector.django import CosineDistance
import numpy as np
from django.core.cache import cache


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
    """
    Classic goal-based ranking.
    """
    scored = []
    for item in model_qs:
        score = goal_scores.get(item.goal_id, 0)
        scored.append((score, item))
    scored.sort(key=lambda x: (x[0], x[1].id), reverse=True)
    return [x[1] for x in scored[:limit]]


def get_user_interest_vector(user):
    """
    Returns an average embedding vector based on user's high-intent items (likes/saves).
    """
    # 1. Activities (Likes/Saves)
    recipe_ids = list(RecipeLike.objects.filter(user=user).values_list("recipe_id", flat=True)) + \
                 list(RecipeSave.objects.filter(user=user).values_list("recipe_id", flat=True))
    product_ids = list(ProductLike.objects.filter(user=user).values_list("product_id", flat=True))
    
    activity_embeddings = list(Embedding.objects.filter(
        Q(content_type="recipe", object_id__in=recipe_ids) |
        Q(content_type="product", object_id__in=product_ids)
    ).values_list("embedding", flat=True))

    # 2. Profile Characteristics
    profile_embeddings = []
    if hasattr(user, 'profile'):
        p = user.profile
        profile_text = f"{p.skin_type} skin. {p.hair_type} {p.hair_texture} hair. {p.skin_concerns}. {p.hair_concerns}".strip()
        if profile_text.replace(".", "").strip():
            profile_embeddings.append(get_embedding(profile_text))

    all_vectors = [np.array(e) for e in activity_embeddings]
    
    # We give profile embeddings a higher weight (e.g. repeat them 3 times) to ensure they strongly influence recs
    for p_vec in profile_embeddings:
        for _ in range(3):
            all_vectors.append(np.array(p_vec))

    if not all_vectors:
        return None

    # Average the vectors
    return np.mean(all_vectors, axis=0).tolist()


def recommend_hybrid(model, user, goal_scores, limit=8):
    """
    Hybrid recommendation with Caching.
    """
    ctype = model.__name__.lower()
    if ctype == "mealplan":
        ctype = "meal_plan"
    
    # Cache lookup
    cache_key = f"user_recs_{user.id}_{ctype}_{limit}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data

    # Base Queryset
    if hasattr(model, "is_published"):
        qs = model.objects.filter(is_published=True)
    elif hasattr(model, "is_active"):
        qs = model.objects.filter(is_active=True)
    else:
        qs = model.objects.all()

    # Cold Start Fallback
    if not goal_scores:
        if hasattr(model, "average_rating"):
            res = list(qs.order_by("-average_rating", "-rating_count")[:limit])
        else:
            res = list(qs.order_by("-id")[:limit])
        cache.set(cache_key, res, 3600)
        return res

    user_vector = get_user_interest_vector(user)
    
    if user_vector:
        related_ids = Embedding.objects.filter(content_type=ctype).order_by(
            CosineDistance("embedding", user_vector)
        ).values_list("object_id", flat=True)[:limit*2]
        
        goal_matches = recommend_by_goal(qs, goal_scores, limit=limit)
        
        if len(goal_matches) < limit:
            semantic_fill = qs.filter(id__in=related_ids).exclude(id__in=[o.id for o in goal_matches])
            res = list(goal_matches) + list(semantic_fill[:limit - len(goal_matches)])
        else:
            res = goal_matches
            
        cache.set(cache_key, res, 3600)
        return res
    
    res = recommend_by_goal(qs, goal_scores, limit=limit)
    cache.set(cache_key, res, 3600)
    return res


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

        recipes = recommend_hybrid(
            Recipe,
            request.user,
            scores,
            limit=4
        )
        products = recommend_hybrid(
            Product,
            request.user,
            scores,
            limit=4
        )
        meal_plans = recommend_hybrid(
            MealPlan,
            request.user,
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
        recipes = recommend_hybrid(
            Recipe,
            request.user,
            scores,
            limit=12
        )
        return Response([{"id": r.id, "title": r.title, "goal": r.goal.slug} for r in recipes])


class RecommendedProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        scores = score_goals_for_user(request.user)
        products = recommend_hybrid(
            Product,
            request.user,
            scores,
            limit=12
        )
        return Response([{"id": p.id, "title": p.name, "goal": p.goal.slug} for p in products])


class RecommendedMealPlansView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        scores = score_goals_for_user(request.user)
        plans = recommend_hybrid(
            MealPlan,
            request.user,
            scores,
            limit=12
        )
        return Response([{"id": m.id, "title": m.title, "goal": m.goal.slug if m.goal else ""} for m in plans])

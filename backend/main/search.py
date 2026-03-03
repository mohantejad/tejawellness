from decimal import Decimal

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from recipes.models import Recipe
from products.models import Product
from ingredients.models import Ingredient
from meal_plans.models import MealPlan


def _safe_media_image(media_qs):
    media = media_qs.first()
    return str(media.image_url) if media and getattr(media.image_url, "name", None) else None


def _safe_price(value):
    if isinstance(value, Decimal):
        return str(value)
    return value


class GlobalSearchView(APIView):
    permission_classes = [AllowAny]

    def _serialize_recipes(self, q):
        recipes = Recipe.objects.filter(is_published=True, title__icontains=q)[:5]
        return [
            {
                "id": r.id,
                "title": r.title,
                "image": _safe_media_image(r.media),
            }
            for r in recipes
        ]

    def _serialize_products(self, q):
        products = Product.objects.filter(is_active=True, name__icontains=q)[:5]
        return [
            {
                "id": p.id,
                "name": p.name,
                "image": str(p.image_url) if getattr(p.image_url, "name", None) else None,
                "price": _safe_price(p.price),
            }
            for p in products
        ]

    def _serialize_ingredients(self, q):
        ingredients = Ingredient.objects.filter(name__icontains=q)[:5]
        return [
            {
                "id": i.id,
                "name": i.name,
                "image": str(i.media.first().image) if i.media.exists() else None,
            }
            for i in ingredients
        ]

    def _serialize_meal_plans(self, q):
        plans = MealPlan.objects.filter(is_published=True, title__icontains=q)[:5]
        return [
            {
                "id": p.id,
                "title": p.title,
                "image": None,
            }
            for p in plans
        ]

    def get(self, request):
        q = request.query_params.get("q", "").strip()
        if not q:
            return Response({"ingredients": [], "recipes": [], "meal_plans": [], "products": []})

        try:
            return Response({
                "ingredients": self._serialize_ingredients(q),
                "recipes": self._serialize_recipes(q),
                "meal_plans": self._serialize_meal_plans(q),
                "products": self._serialize_products(q),
            })
        except Exception:
            return Response({"ingredients": [], "recipes": [], "meal_plans": [], "products": []})

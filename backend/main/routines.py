from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .recommendations import score_goals_for_user, recommend_hybrid
from recipes.models import Recipe
from products.models import Product
from ingredients.models import Ingredient
from rag.search import search_embeddings

class RoutineView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        scores = score_goals_for_user(request.user)
        
        # Get personalized recommendations for a daily routine
        recipes = recommend_hybrid(Recipe, request.user, scores, limit=3)
        products = recommend_hybrid(Product, request.user, scores, limit=2)

        routine = {
            "morning": {
                "product": products[0].name if len(products) > 0 else "Gentle Cleanser",
                "breakfast": recipes[0].title if len(recipes) > 0 else "Healthy Bowl"
            },
            "afternoon": {
                "lunch": recipes[1].title if len(recipes) > 1 else "Nutrient Rich Salad"
            },
            "evening": {
                "product": products[1].name if len(products) > 1 else "Night Serum",
                "dinner": recipes[2].title if len(recipes) > 2 else "Light Evening Meal"
            }
        }
        return Response(routine)

class IngredientSubstituteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ingredient_name = request.query_params.get("ingredient", "")
        if not ingredient_name:
            return Response({"error": "Missing ingredient parameter"}, status=400)

        # Use semantic search to find similar ingredients
        results = search_embeddings(
            f"Alternative to {ingredient_name}", 
            top_k=5, 
            content_types=["ingredient"]
        )

        substitutes = []
        for res in results:
            if res.metadata.get("title", "").lower() != ingredient_name.lower():
                substitutes.append({
                    "name": res.metadata.get("title", "Unknown"),
                    "reason": res.text[:150] + "..."
                })

        return Response({
            "original": ingredient_name,
            "substitutes": substitutes[:3]
        })

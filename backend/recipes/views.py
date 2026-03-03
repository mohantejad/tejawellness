from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response

from .permission import IsOwnerOrReadOnly
from .models import Recipe, RecipeComment, RecipeMedia, RecipeIngredient, RecipeReview, RecipeLike, RecipeSave
from .serializers import RecipeCommentSerializer, RecipeReviewSerializer, RecipeSerializer, RecursiveCommentSerializer
from .utils import caluclate_recipe_nutrition, update_recipe_rating
from .filters import RecipeFilter


class RecipeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Recipe.objects.filter(is_published=True).order_by('-created_at')
    serializer_class = RecipeSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = RecipeFilter
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "calories", "protein", "carbs", "fat", "average_rating"]
    ordering = ["-created_at"]


    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        recipe = self.get_object()
        obj, created = RecipeLike.objects.get_or_create(recipe=recipe, user=request.user)
        if not created:
            obj.delete()
            return Response({"liked": False, "like_count": recipe.likes.count()})
        return Response({"liked": True, "like_count": recipe.likes.count()})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def save(self, request, pk=None):
        recipe = self.get_object()
        obj, created = RecipeSave.objects.get_or_create(recipe=recipe, user=request.user)
        if not created:
            obj.delete()
            return Response({"saved": False, "save_count": recipe.saves.count()})
        return Response({"saved": True, "save_count": recipe.saves.count()})

    def perform_create(self, serializer):
        recipe = serializer.save(author=self.request.user)

        ingredients_data = self.request.data.get('ingredients', [])
        recipe_ingredients = []
        for item in ingredients_data:
            ri = RecipeIngredient.objects.create(
                recipe=recipe,
                ingredient_id=item['ingredient_id'],
                grams=item['grams']
            )
            recipe_ingredients.append(ri)

        nutrition = caluclate_recipe_nutrition(recipe_ingredients)
        for key, value in nutrition.items():
            setattr(recipe, key, value)
        recipe.save()

        media = self.request.data.get('media', [])
        for m in media:
            RecipeMedia.objects.create(
                recipe=recipe,
                image_url=m.get('image_url', ''),
                video_url=m.get('video_url', ''),
                is_primary=m.get('is_primary', False),
                order=m.get('order', 0)
            )   

class RecipeReviewViewSet(viewsets.ModelViewSet):
    queryset = RecipeReview.objects.all().order_by('-created_at')
    serializer_class = RecipeReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        return RecipeReview.objects.filter(recipe_id=self.kwargs['recipe_id']).order_by('-created_at')
    
    def perform_create(self, serializer):
        review, _ = RecipeReview.objects.update_or_create(
            recipe_id=self.kwargs["recipe_id"],
            user=self.request.user,
            defaults={"rating": serializer.validated_data["rating"]},
        )
        update_recipe_rating(review.recipe)


    def perform_update(self, serializer):
        review = serializer.save()
        update_recipe_rating(review.recipe)

    def perform_destroy(self, instance):
        recipe = instance.recipe
        instance.delete()
        update_recipe_rating(recipe)

class RecipeCommentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        recipe_id = self.kwargs["recipe_id"]
        queryset = RecipeComment.objects.filter(recipe_id=recipe_id)

        if self.action == "list":
            return queryset.filter(parent__isnull=True)

        return queryset

    def get_serializer_class(self):
        if self.action == "list":
            return RecursiveCommentSerializer
        return RecipeCommentSerializer

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            recipe_id=self.kwargs["recipe_id"]
        )
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeCommentViewSet, RecipeReviewViewSet, RecipeViewSet

router = DefaultRouter()
router.register("recipes", RecipeViewSet, basename="recipe")

urlpatterns = [
    path("", include(router.urls)),
    path("recipes/<int:recipe_id>/reviews/", RecipeReviewViewSet.as_view({
        "get": "list",
        "post": "create"
    })),
    path("recipes/<int:recipe_id>/reviews/<int:pk>/", RecipeReviewViewSet.as_view({
        "get": "retrieve",
        "patch": "partial_update",
        "delete": "destroy"
    })),
    path("recipes/<int:recipe_id>/comments/", RecipeCommentViewSet.as_view({
        "get": "list",
        "post": "create"
    })),
    path("recipes/<int:recipe_id>/comments/<int:pk>/", RecipeCommentViewSet.as_view({
        "get": "retrieve",
        "patch": "partial_update",
        "delete": "destroy"
    })),
]

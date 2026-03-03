from rest_framework import serializers
from goals.serializers import GoalSerializer
from recipes.models import Recipe
from recipes.serializers import RecipeMediaSerializer
from .models import MealPlan, MealPlanItem


class RecipeMiniSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()

    def get_primary_image(self, obj):
        media = obj.media.filter(is_primary=True).first() or obj.media.first()
        return media.image_url.url if media and media.image_url else None

    class Meta:
        model = Recipe
        fields = ["id", "title", "primary_image", "calories", "protein"]


class MealPlanItemSerializer(serializers.ModelSerializer):
    recipe = RecipeMiniSerializer(read_only=True)

    class Meta:
        model = MealPlanItem
        fields = ["id", "day", "meal_type", "order", "recipe"]


class MealPlanSerializer(serializers.ModelSerializer):
    goal = GoalSerializer(read_only=True)
    items = MealPlanItemSerializer(many=True, read_only=True)
    total_recipes = serializers.SerializerMethodField()

    def get_total_recipes(self, obj):
        return obj.items.count()

    class Meta:
        model = MealPlan
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "duration_days",
            "meals_per_day",
            "price",
            "is_published",
            "created_at",
            "updated_at",
            "goal",
            "items",
            "total_recipes",
        ]

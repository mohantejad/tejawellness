from rest_framework import serializers
from .models import Goal


class GoalSerializer(serializers.ModelSerializer):
    image_url = serializers.ImageField(read_only=True)
    image_recipes = serializers.ImageField(read_only=True)
    image_products = serializers.ImageField(read_only=True)
    image_articles = serializers.ImageField(read_only=True)

    class Meta:
        model = Goal
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "image_url",
            "image_recipes",
            "image_products",
            "image_articles",
        ]

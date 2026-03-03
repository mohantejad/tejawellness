from rest_framework import serializers

from goals.models import Goal
from goals.serializers import GoalSerializer
from .models import Recipe, RecipeComment, RecipeMedia, RecipeIngredient, RecipeReview
from ingredients.serializers import IngredientSerializer
from ingredients.models import Ingredient


class RecipeMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeMedia
        fields = ['id', 'image_url', 'video_url', 'is_primary', 'order']

    def validate(self, data):
        if not data.get('image_url') and not data.get('video_url'):
            raise serializers.ValidationError(
                'Either image_url or video_url must be provided.')
        return data


class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)
    ingredient_id = serializers.PrimaryKeyRelatedField(
        queryset=Ingredient.objects.all(),
        source='ingredient',
        write_only=True
    )

    class Meta:
        model = RecipeIngredient
        fields = ['id', 'ingredient', 'ingredient_id', 'grams']


class RecipeReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = RecipeReview
        fields = ['id', 'user', 'rating', 'created_at']


class RecipeSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.email')
    media = RecipeMediaSerializer(many=True, read_only=True)
    recipe_ingredients = RecipeIngredientSerializer(many=True, read_only=True)
    reviews = RecipeReviewSerializer(many=True, read_only=True)
    like_count = serializers.SerializerMethodField()
    save_count = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()
    primary_video = serializers.SerializerMethodField()
    goal = GoalSerializer(read_only=True)
    goal_id = serializers.PrimaryKeyRelatedField(
        queryset=Goal.objects.all(),
        source='goal',
        write_only=True,
        required=False
    )

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_save_count(self, obj):
        return obj.saves.count()

    def get_primary_image(self, obj):
        media = obj.media.filter(is_primary=True).first() or obj.media.first()
        return media.image_url.url if media and media.image_url else None

    def get_primary_video(self, obj):
        media = obj.media.filter(is_primary=True).first() or obj.media.first()
        return media.video_url.url if media and media.video_url else None

    review_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    def get_review_count(self, obj):
        return obj.reviews.count()

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.likes.filter(user=request.user).exists()

    def get_is_saved(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.saves.filter(user=request.user).exists()

    class Meta:
        model = Recipe
        fields = [
            'id', 'author', 'title', 'slug', 'description',
            'difficulty', 'diet_type', 'instructions', 'meal_type', 'meal_time',
            'prep_time', 'cook_time', 'servings',
            'calories', 'protein', 'carbs',
            'fat', 'fiber', 'vitamin_a',
            'vitamin_c', 'iron', 'calcium',
            'potassium', 'average_rating', 'rating_count',
            'is_published', 'created_at', 'updated_at',
            'media', 'recipe_ingredients', 'reviews',
            'like_count', 'save_count', 'primary_image', 'primary_video',
            'review_count', 'comment_count',
            'is_liked', 'is_saved',
            'goal', 'goal_id',
        ]


class RecursiveCommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = RecipeComment
        fields = ['id', 'user', 'text', 'created_at', 'updated_at', 'replies']

    def get_replies(self, obj):
        return RecursiveCommentSerializer(obj.replies.all(), many=True).data


class RecipeCommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = RecipeComment
        fields = ['id', 'recipe', 'parent', 'user',
                  'text', 'created_at', 'updated_at']
        read_only_fields = ['recipe', 'user']

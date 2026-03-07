from rest_framework import serializers
from .models import (
    Ingredient,
    IngredientMedia,
    IngredientVitamin,
    IngredientMineral,
    IngredientMicronutrient,
    IngredientGoal,
)
from goals.serializers import GoalSerializer


class IngredientMediaSerializer(serializers.ModelSerializer):
    image_url = serializers.ImageField(source='image', read_only=True)

    class Meta:
        model  = IngredientMedia
        fields = ['id', 'image_url', 'video_url', 'is_primary', 'order']

    def validate(self, data):
        if not data.get('image') and not data.get('video_url'):
            raise serializers.ValidationError('Either image or video_url must be provided.')
        return data


class IngredientVitaminSerializer(serializers.ModelSerializer):
    class Meta:
        model  = IngredientVitamin
        fields = ['id', 'name', 'percent_dv']


class IngredientMineralSerializer(serializers.ModelSerializer):
    class Meta:
        model  = IngredientMineral
        fields = ['id', 'name', 'percent_dv']


class IngredientMicronutrientSerializer(serializers.ModelSerializer):
    class Meta:
        model  = IngredientMicronutrient
        fields = ['id', 'name']


class IngredientSerializer(serializers.ModelSerializer):
    media          = IngredientMediaSerializer(many=True, read_only=True)
    vitamins       = IngredientVitaminSerializer(many=True, read_only=True)
    minerals       = IngredientMineralSerializer(many=True, read_only=True)
    micronutrients = IngredientMicronutrientSerializer(many=True, read_only=True)
    goal_links     = serializers.SerializerMethodField()
    primary_image  = serializers.SerializerMethodField()

    def get_goal_links(self, obj):
        links = IngredientGoal.objects.filter(ingredient=obj).select_related('goal')
        return [
            {
                'id':           link.id,
                'goal':         GoalSerializer(link.goal).data,
                'benefit_text': link.benefit_text,
            }
            for link in links
        ]

    def get_primary_image(self, obj):
        media = obj.media.first()
        if not media or not getattr(media, 'image', None):
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(media.image.url) if request else media.image.url

    class Meta:
        model  = Ingredient
        fields = [
            'id', 'name', 'slug', 'ingredient_type',
            'calories', 'protein', 'carbs', 'fat', 'fiber',
            'description', 'buy_url',
            'media', 'vitamins', 'minerals', 'micronutrients',
            'goal_links', 'primary_image',
        ]

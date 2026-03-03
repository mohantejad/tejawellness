from rest_framework import serializers
from .models import Ingredient, IngredientMedia, IngredientBenefit, IngredientWarning, IngredientGoal
from goals.serializers import GoalSerializer


class IngredientMediaSerializer(serializers.ModelSerializer):
    image_url = serializers.ImageField(source="image", read_only=True)

    class Meta:
        model = IngredientMedia
        fields = ['id', 'image_url', 'video_url', 'is_primary', 'order']

    def validate(self, data):
        if not data.get('image') and not data.get('video_url'):
            raise serializers.ValidationError("Either image or video_url must be provided.")
        return data


class IngredientBenefitSerializer(serializers.ModelSerializer):
    class Meta:
        model = IngredientBenefit
        fields = ['id', 'text']

class IngredientWarningSerializer(serializers.ModelSerializer):
    class Meta:
        model = IngredientWarning
        fields = ['id', 'text']

class IngredientSerializer(serializers.ModelSerializer):
    media = IngredientMediaSerializer(many=True, read_only=True)
    benefits = IngredientBenefitSerializer(many=True, read_only=True)
    warnings = IngredientWarningSerializer(many=True, read_only=True)
    goal_links = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()

    def get_goal_links(self, obj):
        links = IngredientGoal.objects.filter(ingredient=obj).select_related("goal")
        return [
            {
                "id": link.id,
                "goal": GoalSerializer(link.goal).data,
                "benefit_text": link.benefit_text,
            }
            for link in links
        ]

    def get_primary_image(self, obj):
        media = obj.media.first()
        if not media or not getattr(media, "image", None):
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(media.image.url) if request else media.image.url

    class Meta:
        model = Ingredient
        fields = [
            'id', 'name', 'slug', 'calories', 
            'carbs', 'protein', 'fat', 'fiber',
            'vitamin_a', 'vitamin_c', 'calcium', 
            'iron', 'potassium', 'description', 
            'media', 'benefits', 'warnings', 'buy_url',
            'goal_links', 'primary_image'
        ]

from rest_framework import serializers
from goals.serializers import GoalSerializer
from goals.models import Goal
from .models import Workout, WorkoutMedia, WorkoutReview, WorkoutComment


class WorkoutMediaSerializer(serializers.ModelSerializer):
    image_url = serializers.ImageField(read_only=True)

    class Meta:
        model = WorkoutMedia
        fields = ['id', 'image_url', 'video_url', 'is_primary', 'order']

    def validate(self, data):
        if not data.get('image_url') and not data.get('video_url'):
            raise serializers.ValidationError('Either image_url or video_url must be provided.')
        return data



class WorkoutReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = WorkoutReview
        fields = ['id', 'user', 'rating', 'created_at']


class RecursiveCommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = WorkoutComment
        fields = ['id', 'user', 'text', 'created_at', 'updated_at', 'replies']

    def get_replies(self, obj):
        return RecursiveCommentSerializer(obj.replies.all(), many=True).data


class WorkoutCommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = WorkoutComment
        fields = ['id', 'workout', 'parent', 'user', 'text', 'created_at', 'updated_at']
        read_only_fields = ['workout', 'user']


class WorkoutSerializer(serializers.ModelSerializer):
    goal = GoalSerializer(read_only=True)
    goal_id = serializers.PrimaryKeyRelatedField(
        source='goal',
        queryset=Goal.objects.all(),
        write_only=True,
        required=False
    )
    media = WorkoutMediaSerializer(many=True, read_only=True)
    reviews = WorkoutReviewSerializer(many=True, read_only=True)

    like_count = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_review_count(self, obj):
        return obj.reviews.count()

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.likes.filter(user=request.user).exists()

    class Meta:
        model = Workout
        fields = [
            'id', 'title', 'slug', 'description',
            'duration_minutes', 'difficulty', 'equipment',
            'is_published', 'average_rating', 'rating_count',
            'created_at', 'updated_at',
            'goal', 'goal_id', 'media', 'reviews',
            'like_count', 'review_count', 'comment_count', 'is_liked'
        ]

from rest_framework import serializers
from goals.serializers import GoalSerializer
from goals.models import Goal
from .models import Article, ArticleReview, ArticleComment


class ArticleReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = ArticleReview
        fields = ['id', 'user', 'rating', 'created_at']


class RecursiveCommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = ArticleComment
        fields = ['id', 'user', 'text', 'created_at', 'updated_at', 'replies']

    def get_replies(self, obj):
        return RecursiveCommentSerializer(obj.replies.all(), many=True).data


class ArticleCommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = ArticleComment
        fields = ['id', 'article', 'parent', 'user', 'text', 'created_at', 'updated_at']
        read_only_fields = ['article', 'user']


class ArticleSerializer(serializers.ModelSerializer):
    goal = GoalSerializer(read_only=True)
    goal_id = serializers.PrimaryKeyRelatedField(
        source='goal',
        queryset=Goal.objects.all(),
        write_only=True,
        required=False
    )
    reviews = ArticleReviewSerializer(many=True, read_only=True)

    image_url = serializers.ImageField(read_only=True)  # ✅ ImageField -> URL

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
        model = Article
        fields = [
            'id', 'title', 'slug', 'summary', 'content',
            'image_url', 'source_url',
            'is_published', 'average_rating', 'rating_count',
            'created_at', 'updated_at',
            'goal', 'goal_id', 'reviews',
            'like_count', 'review_count', 'comment_count', 'is_liked'
        ]

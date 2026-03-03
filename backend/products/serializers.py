from rest_framework import serializers
from goals.serializers import GoalSerializer
from goals.models import Goal
from .models import Product, ProductReview, ProductComment, ProductMedia

class ProductReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = ProductReview
        fields = ['id', 'user', 'rating', 'created_at']

class RecursiveCommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = ProductComment
        fields = ['id', 'user', 'text', 'created_at', 'updated_at', 'replies']

    def get_replies(self, obj):
        return RecursiveCommentSerializer(obj.replies.all(), many=True).data

class ProductCommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = ProductComment
        fields = ['id', 'product', 'parent', 'user', 'text', 'created_at', 'updated_at']
        read_only_fields = ['product', 'user']

class ProductMediaSerializer(serializers.ModelSerializer):
    image_url = serializers.ImageField(source="image", read_only=True)

    class Meta:
        model = ProductMedia
        fields = ["id", "image_url", "video_url", "is_primary", "order"]

    def validate(self, data):
        if not data.get("image") and not data.get("video_url"):
            raise serializers.ValidationError("Either image or video_url must be provided.")
        return data
class ProductSerializer(serializers.ModelSerializer):
    goal = GoalSerializer(read_only=True)
    goal_id = serializers.PrimaryKeyRelatedField(
        source='goal',
        queryset=Goal.objects.all(),
        write_only=True,
        required=False
    )
    reviews = ProductReviewSerializer(many=True, read_only=True)
    media = ProductMediaSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    primary_video = serializers.SerializerMethodField()
    image_url = serializers.ImageField(read_only=True)
    like_count = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_primary_image(self, obj):
        media = obj.media.filter(is_primary=True).first() or obj.media.first()
        return media.image.url if media and media.image else None

    def get_primary_video(self, obj):
        media = obj.media.filter(is_primary=True).first() or obj.media.first()
        return media.video_url.url if media and media.video_url else None

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
        model = Product
        fields = [
            'id', 'name', 'slug', 'description',
            'price', 'compare_at_price', 'image_url', 'affiliate_url',
            'stock', 'is_active',
            'average_rating', 'rating_count',
            'goal', 'goal_id', 'created_at',
            'reviews', 'like_count',
            'review_count', 'comment_count',
            'is_liked', 'media', 'primary_image', 'primary_video'
        ]

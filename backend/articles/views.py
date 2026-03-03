from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Article, ArticleReview, ArticleComment, ArticleLike
from .serializers import ArticleSerializer, ArticleReviewSerializer, ArticleCommentSerializer, RecursiveCommentSerializer
from .filters import ArticleFilter
from .permissions import IsAdminOrReadOnly
from .utils import update_article_rating
from recipes.permission import IsOwnerOrReadOnly


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.filter(is_published=True).order_by('-created_at')
    serializer_class = ArticleSerializer
    permission_classes = [IsAdminOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ArticleFilter
    search_fields = ['title', 'summary', 'content']
    ordering_fields = ['created_at', 'average_rating']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        article = self.get_object()
        obj, created = ArticleLike.objects.get_or_create(article=article, user=request.user)
        if not created:
            obj.delete()
            return Response({'liked': False, 'like_count': article.likes.count()})
        return Response({'liked': True, 'like_count': article.likes.count()})


class ArticleReviewViewSet(viewsets.ModelViewSet):
    queryset = ArticleReview.objects.all().order_by('-created_at')
    serializer_class = ArticleReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        return ArticleReview.objects.filter(article_id=self.kwargs['article_id']).order_by('-created_at')

    def perform_create(self, serializer):
        review, _ = ArticleReview.objects.update_or_create(
            article_id=self.kwargs['article_id'],
            user=self.request.user,
            defaults={"rating": serializer.validated_data["rating"]},
        )
        update_article_rating(review.article)

    def perform_update(self, serializer):
        review = serializer.save()
        update_article_rating(review.article)

    def perform_destroy(self, instance):
        article = instance.article
        instance.delete()
        update_article_rating(article)


class ArticleCommentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        article_id = self.kwargs['article_id']
        queryset = ArticleComment.objects.filter(article_id=article_id)
        if self.action == 'list':
            return queryset.filter(parent__isnull=True)
        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return RecursiveCommentSerializer
        return ArticleCommentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, article_id=self.kwargs['article_id'])

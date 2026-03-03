from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, ArticleReviewViewSet, ArticleCommentViewSet

router = DefaultRouter()
router.register('articles', ArticleViewSet, basename='article')

article_review_list = ArticleReviewViewSet.as_view({'get': 'list', 'post': 'create'})
article_review_detail = ArticleReviewViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})

article_comment_list = ArticleCommentViewSet.as_view({'get': 'list', 'post': 'create'})
article_comment_detail = ArticleCommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})

urlpatterns = [
    path('', include(router.urls)),
    path('articles/<int:article_id>/reviews/', article_review_list, name='article-review-list'),
    path('articles/<int:article_id>/reviews/<int:pk>/', article_review_detail, name='article-review-detail'),
    path('articles/<int:article_id>/comments/', article_comment_list, name='article-comment-list'),
    path('articles/<int:article_id>/comments/<int:pk>/', article_comment_detail, name='article-comment-detail'),
]

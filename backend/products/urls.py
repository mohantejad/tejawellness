from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, ProductReviewViewSet, ProductCommentViewSet

router = DefaultRouter()
router.register('products', ProductViewSet, basename='product')

products_review_list = ProductReviewViewSet.as_view({'get': 'list', 'post': 'create'})
products_review_detail = ProductReviewViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})

products_comment_list = ProductCommentViewSet.as_view({'get': 'list', 'post': 'create'})
products_comment_detail = ProductCommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})

urlpatterns = [
    path('', include(router.urls)),
    path('products/<int:product_id>/reviews/', products_review_list, name='product-review-list'),
    path('products/<int:product_id>/reviews/<int:pk>/', products_review_detail, name='product-review-detail'),
    path('products/<int:product_id>/comments/', products_comment_list, name='product-comment-list'),
    path('products/<int:product_id>/comments/<int:pk>/', products_comment_detail, name='product-comment-detail'),
]

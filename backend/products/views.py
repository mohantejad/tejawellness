from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Product, ProductReview, ProductComment, ProductLike
from .serializers import ProductSerializer, ProductReviewSerializer, ProductCommentSerializer, RecursiveCommentSerializer
from .filters import ProductFilter
from .utils import update_product_rating
from recipes.permission import IsOwnerOrReadOnly


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'price']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        product = self.get_object()
        obj, created = ProductLike.objects.get_or_create(product=product, user=request.user)
        if not created:
            obj.delete()
            return Response({'liked': False, 'like_count': product.likes.count()})
        return Response({'liked': True, 'like_count': product.likes.count()})


class ProductReviewViewSet(viewsets.ModelViewSet):
    queryset = ProductReview.objects.all().order_by('-created_at')
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        return ProductReview.objects.filter(product_id=self.kwargs['product_id']).order_by('-created_at')

    def perform_create(self, serializer):
        review, _ = ProductReview.objects.update_or_create(
            product_id=self.kwargs["product_id"],
            user=self.request.user,
            defaults={"rating": serializer.validated_data["rating"]},
        )
        update_product_rating(review.product)

    def perform_update(self, serializer):
        review = serializer.save()
        update_product_rating(review.product)

    def perform_destroy(self, instance):
        product = instance.product
        instance.delete()
        update_product_rating(product)


class ProductCommentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        queryset = ProductComment.objects.filter(product_id=product_id)
        if self.action == 'list':
            return queryset.filter(parent__isnull=True)
        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return RecursiveCommentSerializer
        return ProductCommentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, product_id=self.kwargs['product_id'])

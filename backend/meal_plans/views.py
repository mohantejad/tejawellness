from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import MealPlan
from .serializers import MealPlanSerializer
from .filters import MealPlanFilter


class MealPlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MealPlan.objects.filter(is_published=True).order_by("-created_at")
    serializer_class = MealPlanSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = MealPlanFilter
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "duration_days", "meals_per_day", "price"]
    ordering = ["-created_at"]

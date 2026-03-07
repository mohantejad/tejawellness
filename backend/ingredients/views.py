from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from .filters import IngredientFilter
from .models import Ingredient
from .serializers import IngredientSerializer
from .permissions import IsAdminOrReadOnly


class IngredientViewSet(viewsets.ModelViewSet):
    queryset           = Ingredient.objects.all().order_by('name')
    serializer_class   = IngredientSerializer
    permission_classes = [IsAdminOrReadOnly]

    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class  = IngredientFilter

    search_fields = [
        'name',
        'description',
        'micronutrients__name',   # search inside micronutrient names too
    ]

    ordering_fields = [
        'name',
        'ingredient_type',
        'calories',
        'protein',
        'carbs',
        'fat',
        'fiber',
    ]
    ordering = ['name']

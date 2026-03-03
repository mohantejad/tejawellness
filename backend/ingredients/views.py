from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from .filters import IngredientFilter
from .models import Ingredient
from .serializers import IngredientSerializer
from .permissions import IsAdminOrReadOnly


class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all().order_by('name')
    serializer_class = IngredientSerializer
    permission_classes = [IsAdminOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = IngredientFilter

    search_fields = [
        'name',
        'description',
        'benefits__text',
        'warnings__text',
    ]

    ordering_fields = [
        'name',
        'calories',
        'carbs',
        'protein',
        'fat',
        'fiber',
        'vitamin_a',
        'vitamin_c',
        'calcium',
        'iron',
        'potassium',
    ]
    ordering = ['name']

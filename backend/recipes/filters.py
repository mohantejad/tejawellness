import django_filters
from .models import Recipe

class RecipeFilter(django_filters.FilterSet):
    min_calories = django_filters.NumberFilter(field_name='calories', lookup_expr='gte')
    max_calories = django_filters.NumberFilter(field_name='calories', lookup_expr='lte')

    min_protein = django_filters.NumberFilter(field_name='protein', lookup_expr='gte')
    max_protein = django_filters.NumberFilter(field_name='protein', lookup_expr='lte')

    min_carbs = django_filters.NumberFilter(field_name='carbs', lookup_expr='gte')
    max_carbs = django_filters.NumberFilter(field_name='carbs', lookup_expr='lte')

    min_fat = django_filters.NumberFilter(field_name='fat', lookup_expr='gte')
    max_fat = django_filters.NumberFilter(field_name='fat', lookup_expr='lte')

    min_fiber = django_filters.NumberFilter(field_name='fiber', lookup_expr='gte')
    max_fiber = django_filters.NumberFilter(field_name='fiber', lookup_expr='lte')

    max_prep_time = django_filters.NumberFilter(field_name='prep_time', lookup_expr='lte')
    max_cook_time = django_filters.NumberFilter(field_name='cook_time', lookup_expr='lte')
    min_servings = django_filters.NumberFilter(field_name='servings', lookup_expr='gte')

    goal = django_filters.CharFilter(field_name='goal__slug', lookup_expr='iexact')
    difficulty = django_filters.CharFilter(field_name='difficulty', lookup_expr='iexact')
    diet_type = django_filters.CharFilter(field_name='diet_type', lookup_expr='iexact')
    meal_type = django_filters.CharFilter(field_name='meal_type', lookup_expr='iexact')

    class Meta:
        model = Recipe
        fields = []

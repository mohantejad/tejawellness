import django_filters
from .models import Ingredient


class IngredientFilter(django_filters.FilterSet):
    min_calories = django_filters.NumberFilter(field_name='calories', lookup_expr='gte')
    max_calories = django_filters.NumberFilter(field_name='calories', lookup_expr='lte')

    min_carbs = django_filters.NumberFilter(field_name='carbs', lookup_expr='gte')
    max_carbs = django_filters.NumberFilter(field_name='carbs', lookup_expr='lte')

    min_protein = django_filters.NumberFilter(field_name='protein', lookup_expr='gte')
    max_protein = django_filters.NumberFilter(field_name='protein', lookup_expr='lte')

    min_fat = django_filters.NumberFilter(field_name='fat', lookup_expr='gte')
    max_fat = django_filters.NumberFilter(field_name='fat', lookup_expr='lte')

    min_fiber = django_filters.NumberFilter(field_name='fiber', lookup_expr='gte')
    max_fiber = django_filters.NumberFilter(field_name='fiber', lookup_expr='lte')

    min_vitamin_a = django_filters.NumberFilter(field_name='vitamin_a', lookup_expr='gte')
    max_vitamin_a = django_filters.NumberFilter(field_name='vitamin_a', lookup_expr='lte')

    min_vitamin_c = django_filters.NumberFilter(field_name='vitamin_c', lookup_expr='gte')
    max_vitamin_c = django_filters.NumberFilter(field_name='vitamin_c', lookup_expr='lte')

    min_calcium = django_filters.NumberFilter(field_name='calcium', lookup_expr='gte')
    max_calcium = django_filters.NumberFilter(field_name='calcium', lookup_expr='lte')

    min_iron = django_filters.NumberFilter(field_name='iron', lookup_expr='gte')
    max_iron = django_filters.NumberFilter(field_name='iron', lookup_expr='lte')

    min_potassium = django_filters.NumberFilter(field_name='potassium', lookup_expr='gte')
    max_potassium = django_filters.NumberFilter(field_name='potassium', lookup_expr='lte')
    goal = django_filters.CharFilter(field_name='goal_links__goal__slug', lookup_expr='iexact')

    class Meta:
        model = Ingredient
        fields = []

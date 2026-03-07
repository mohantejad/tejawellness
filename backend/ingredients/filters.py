import django_filters
from .models import Ingredient


class IngredientFilter(django_filters.FilterSet):
    # Macro filters (min/max)
    min_calories = django_filters.NumberFilter(field_name='calories', lookup_expr='gte')
    max_calories = django_filters.NumberFilter(field_name='calories', lookup_expr='lte')

    min_protein  = django_filters.NumberFilter(field_name='protein', lookup_expr='gte')
    max_protein  = django_filters.NumberFilter(field_name='protein', lookup_expr='lte')

    min_carbs    = django_filters.NumberFilter(field_name='carbs', lookup_expr='gte')
    max_carbs    = django_filters.NumberFilter(field_name='carbs', lookup_expr='lte')

    min_fat      = django_filters.NumberFilter(field_name='fat', lookup_expr='gte')
    max_fat      = django_filters.NumberFilter(field_name='fat', lookup_expr='lte')

    min_fiber    = django_filters.NumberFilter(field_name='fiber', lookup_expr='gte')
    max_fiber    = django_filters.NumberFilter(field_name='fiber', lookup_expr='lte')

    # Category filter  — e.g. ?ingredient_type=fruits
    ingredient_type = django_filters.ChoiceFilter(choices=Ingredient.INGREDIENT_TYPES)

    # Goal filter — e.g. ?goal=heart-health
    goal = django_filters.CharFilter(field_name='goal_links__goal__slug', lookup_expr='iexact')

    class Meta:
        model  = Ingredient
        fields = []

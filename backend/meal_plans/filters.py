import django_filters
from .models import MealPlan


class MealPlanFilter(django_filters.FilterSet):
    goal = django_filters.CharFilter(field_name="goal__slug", lookup_expr="iexact")
    min_duration = django_filters.NumberFilter(field_name="duration_days", lookup_expr="gte")
    max_duration = django_filters.NumberFilter(field_name="duration_days", lookup_expr="lte")
    min_meals = django_filters.NumberFilter(field_name="meals_per_day", lookup_expr="gte")
    max_meals = django_filters.NumberFilter(field_name="meals_per_day", lookup_expr="lte")
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = MealPlan
        fields = []

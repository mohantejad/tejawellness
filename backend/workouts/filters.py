import django_filters
from .models import Workout

class WorkoutFilter(django_filters.FilterSet):
    goal = django_filters.CharFilter(field_name='goal__slug', lookup_expr='iexact')
    min_duration = django_filters.NumberFilter(field_name='duration_minutes', lookup_expr='gte')
    max_duration = django_filters.NumberFilter(field_name='duration_minutes', lookup_expr='lte')

    class Meta:
        model = Workout
        fields = []

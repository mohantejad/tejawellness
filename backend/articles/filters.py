import django_filters
from .models import Article

class ArticleFilter(django_filters.FilterSet):
    goal = django_filters.CharFilter(field_name='goal__slug', lookup_expr='iexact')

    class Meta:
        model = Article
        fields = []

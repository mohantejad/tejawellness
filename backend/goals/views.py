from rest_framework import viewsets, permissions
from rest_framework.pagination import PageNumberPagination
from django.db.models import Case, When, IntegerField, Value
from .models import Goal
from .serializers import GoalSerializer


class GoalPagination(PageNumberPagination):
    page_size = 3


class GoalViewSet(viewsets.ReadOnlyModelViewSet):
    PRIORITY_SLUGS = [
        "skin-care",
        "hair-care",
        "weight-loss",
        "lean-body-recomposition",
        "gut-health",
        "stress-relief",
        "better-sleep",
        "anti-inflammation",
        "hormone-balance",
        "immunity",
        "energy-boost",
        "healthy-aging-longevity",
    ]

    def get_queryset(self):
        order = {
            slug: idx for idx, slug in enumerate(self.PRIORITY_SLUGS)
        }
        priority_case = Case(
            *[
                When(slug=slug, then=Value(idx))
                for slug, idx in order.items()
            ],
            default=Value(999),
            output_field=IntegerField(),
        )
        return Goal.objects.all().annotate(priority=priority_case).order_by("priority", "name")
    serializer_class = GoalSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = GoalPagination
    lookup_field = "slug"

from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Workout, WorkoutReview, WorkoutComment, WorkoutLike
from .serializers import WorkoutSerializer, WorkoutReviewSerializer, WorkoutCommentSerializer, RecursiveCommentSerializer
from .filters import WorkoutFilter
from .permissions import IsAdminOrReadOnly
from .utils import update_workout_rating
from recipes.permission import IsOwnerOrReadOnly


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.filter(is_published=True).order_by('-created_at')
    serializer_class = WorkoutSerializer
    permission_classes = [IsAdminOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = WorkoutFilter
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'duration_minutes', 'average_rating']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        workout = self.get_object()
        obj, created = WorkoutLike.objects.get_or_create(workout=workout, user=request.user)
        if not created:
            obj.delete()
            return Response({'liked': False, 'like_count': workout.likes.count()})
        return Response({'liked': True, 'like_count': workout.likes.count()})


class WorkoutReviewViewSet(viewsets.ModelViewSet):
    queryset = WorkoutReview.objects.all().order_by('-created_at')
    serializer_class = WorkoutReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        return WorkoutReview.objects.filter(workout_id=self.kwargs['workout_id']).order_by('-created_at')

    def perform_create(self, serializer):
        review, _ = WorkoutReview.objects.update_or_create(
            workout_id=self.kwargs["workout_id"],
            user=self.request.user,
            defaults={"rating": serializer.validated_data["rating"]},
        )
        update_workout_rating(review.workout)


    def perform_update(self, serializer):
        review = serializer.save()
        update_workout_rating(review.workout)

    def perform_destroy(self, instance):
        workout = instance.workout
        instance.delete()
        update_workout_rating(workout)


class WorkoutCommentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        workout_id = self.kwargs['workout_id']
        queryset = WorkoutComment.objects.filter(workout_id=workout_id)
        if self.action == 'list':
            return queryset.filter(parent__isnull=True)
        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return RecursiveCommentSerializer
        return WorkoutCommentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, workout_id=self.kwargs['workout_id'])

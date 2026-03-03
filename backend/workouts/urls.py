from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkoutViewSet, WorkoutReviewViewSet, WorkoutCommentViewSet

router = DefaultRouter()
router.register('workouts', WorkoutViewSet, basename='workout')

workout_review_list = WorkoutReviewViewSet.as_view({'get': 'list', 'post': 'create'})
workout_review_detail = WorkoutReviewViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})

workout_comment_list = WorkoutCommentViewSet.as_view({'get': 'list', 'post': 'create'})
workout_comment_detail = WorkoutCommentViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})

urlpatterns = [
    path('', include(router.urls)),
    path('workouts/<int:workout_id>/reviews/', workout_review_list, name='workout-review-list'),
    path('workouts/<int:workout_id>/reviews/<int:pk>/', workout_review_detail, name='workout-review-detail'),
    path('workouts/<int:workout_id>/comments/', workout_comment_list, name='workout-comment-list'),
    path('workouts/<int:workout_id>/comments/<int:pk>/', workout_comment_detail, name='workout-comment-detail'),
]

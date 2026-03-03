from django.db import models
from .models import WorkoutReview

def update_workout_rating(workout):
    reviews = WorkoutReview.objects.filter(workout=workout)
    count = reviews.count()
    avg = reviews.aggregate(avg_rating=models.Avg('rating'))['avg_rating'] or 0
    workout.average_rating = avg
    workout.rating_count = count
    workout.save(update_fields=['average_rating', 'rating_count'])

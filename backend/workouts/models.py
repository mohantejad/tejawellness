from django.conf import settings
from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
from goals.models import Goal


class Workout(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, db_index=True)
    description = models.TextField(blank=True)

    goal = models.ForeignKey(Goal, on_delete=models.SET_NULL, null=True, related_name='workouts')

    duration_minutes = models.PositiveIntegerField(default=0)
    difficulty = models.CharField(max_length=50, blank=True)
    equipment = models.TextField(blank=True)

    is_published = models.BooleanField(default=True)

    average_rating = models.FloatField(default=0)
    rating_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            counter = 1
            while Workout.objects.filter(slug=slug).exists():
                slug = f'{base}-{counter}'
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class WorkoutMedia(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='media')
    image_url = models.ImageField(upload_to="workouts/", blank=True, null=True)
    video_url = models.FileField(upload_to="workouts/videos/", blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']


class WorkoutReview(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='reviews', db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('workout', 'user')
        ordering = ['-created_at']


class WorkoutComment(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='replies'
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=['workout', 'created_at'])]


class WorkoutLike(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('workout', 'user')

from django.contrib import admin
from .models import Workout, WorkoutMedia, WorkoutReview, WorkoutComment, WorkoutLike

@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'goal', 'is_published', 'average_rating', 'rating_count', 'created_at')
    search_fields = ('title', 'description')
    list_filter = ('is_published', 'goal')
    prepopulated_fields = {'slug': ('title',)}

admin.site.register(WorkoutMedia)
admin.site.register(WorkoutReview)
admin.site.register(WorkoutComment)
admin.site.register(WorkoutLike)

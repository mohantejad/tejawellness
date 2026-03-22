from django.db import models
from django.conf import settings

class ProgressEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress_entries')
    photo = models.ImageField(upload_to='progress/', blank=True, null=True)
    notes = models.TextField(blank=True)
    rating = models.PositiveIntegerField(default=5, help_text="User's self-rating of their hair/skin state (1-10)")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Entry for {self.user.email} on {self.created_at.date()}"

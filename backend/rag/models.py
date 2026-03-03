from django.db import models
from pgvector.django import VectorField

class Embedding(models.Model):
    content_type = models.CharField(max_length=50) 
    object_id = models.PositiveIntegerField()
    text = models.TextField()
    embedding = VectorField(dimensions=384) 
    metadata = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

from rest_framework import serializers
from .models import ProgressEntry

class ProgressEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressEntry
        fields = ['id', 'photo', 'notes', 'rating', 'created_at']
        read_only_fields = ['id', 'created_at']

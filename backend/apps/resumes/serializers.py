from rest_framework import serializers

from apps.resumes.models import Resume


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'title', 'content', 'template', 'accent_color', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

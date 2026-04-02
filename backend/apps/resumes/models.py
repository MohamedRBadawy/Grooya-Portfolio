from django.conf import settings
from django.db import models


class Resume(models.Model):
    """Editable resume document stored separately from published portfolios."""

    class Template(models.TextChoices):
        CLASSIC = 'classic', 'Classic'
        MODERN = 'modern', 'Modern'
        CREATIVE = 'creative', 'Creative'

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=120)
    content = models.JSONField(default=dict)
    template = models.CharField(max_length=20, choices=Template.choices, default=Template.CLASSIC)
    accent_color = models.CharField(max_length=16, default='#1e8c8c')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self) -> str:
        return self.title

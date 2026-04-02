"""Account models for profile metadata and lightweight catalog storage."""

from django.conf import settings
from django.db import models


class AccountProfile(models.Model):
    """Application-specific user metadata kept separate from Django auth."""

    class Role(models.TextChoices):
        USER = 'user', 'User'
        ADMIN = 'admin', 'Admin'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    title = models.CharField(max_length=120, blank=True)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.USER)
    project_catalog = models.JSONField(default=list, blank=True)
    skill_catalog = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['user_id']

    def save(self, *args, **kwargs):
        """Mirror Django staff/superuser permissions into the product role."""

        if self.user.is_staff or self.user.is_superuser:
            self.role = self.Role.ADMIN
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f'profile:{self.user_id}'

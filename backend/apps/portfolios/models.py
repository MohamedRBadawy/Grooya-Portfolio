from django.conf import settings
from django.db import models


class Portfolio(models.Model):
    """Portfolio document with design and page content stored in JSON fields."""

    class Track(models.TextChoices):
        JOB_SEEKER = 'jobSeeker', 'Job seeker'
        FREELANCER = 'freelancer', 'Freelancer'

    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        ARCHIVED = 'archived', 'Archived'

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='portfolios')
    title = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True)
    track = models.CharField(max_length=20, choices=Track.choices, default=Track.JOB_SEEKER)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    design = models.JSONField(default=dict)
    pages = models.JSONField(default=list)
    assets = models.JSONField(default=list, blank=True)
    seo_title = models.CharField(max_length=180, blank=True)
    seo_description = models.TextField(blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self) -> str:
        return self.title

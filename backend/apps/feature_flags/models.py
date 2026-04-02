from django.db import models


class FeatureFlag(models.Model):
    """Server-owned flags that control launch visibility for unstable features."""

    key = models.SlugField(max_length=64, unique=True)
    enabled = models.BooleanField(default=False)
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['key']

    def __str__(self) -> str:
        return f'{self.key}={"on" if self.enabled else "off"}'

from django.db import models

from apps.portfolios.models import Portfolio


class Lead(models.Model):
    """Incoming contact form submissions from public portfolios."""

    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='leads')
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.name} -> {self.portfolio_id}'

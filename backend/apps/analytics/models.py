from django.db import models

from apps.portfolios.models import Portfolio


class PortfolioViewEvent(models.Model):
    """Raw portfolio traffic event used to build analytics aggregates."""

    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='view_events')
    path = models.CharField(max_length=255, default='/')
    visitor_id = models.CharField(max_length=128, blank=True)
    referrer = models.CharField(max_length=255, blank=True)
    user_agent = models.TextField(blank=True)
    ip_hash = models.CharField(max_length=128, blank=True)
    occurred_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-occurred_at']

    def __str__(self) -> str:
        return f'{self.portfolio_id}:{self.path}'

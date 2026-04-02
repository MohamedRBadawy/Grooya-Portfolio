from django.conf import settings
from django.db import models


class AIEntitlementPolicy(models.Model):
    """Plan-level AI entitlement policy used by the backend quota system."""

    class Tier(models.TextChoices):
        FREE = 'free', 'Free'
        STARTER = 'starter', 'Starter'
        PRO = 'pro', 'Pro'

    tier = models.CharField(max_length=20, choices=Tier.choices)
    feature = models.SlugField(max_length=64)
    monthly_quota = models.PositiveIntegerField(default=0)
    enabled = models.BooleanField(default=True)
    heavy_action = models.BooleanField(default=False)
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['tier', 'feature']
        unique_together = ('tier', 'feature')

    def __str__(self) -> str:
        return f'{self.tier}:{self.feature}'


class AIProviderSetting(models.Model):
    """Stores provider-level configuration so the app can swap AI backends later."""

    provider = models.SlugField(max_length=32, unique=True)
    enabled = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    config = models.JSONField(default=dict, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['provider']

    def __str__(self) -> str:
        return self.provider


class AIUsageRecord(models.Model):
    """Audit trail for AI usage, keyed by authenticated user or anonymous session."""

    class Status(models.TextChoices):
        SUCCESS = 'success', 'Success'
        FAILED = 'failed', 'Failed'
        REJECTED = 'rejected', 'Rejected'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='ai_usage_records',
    )
    portfolio = models.ForeignKey(
        'portfolios.Portfolio',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='ai_usage_records',
    )
    session_key = models.CharField(max_length=64, blank=True, db_index=True)
    feature = models.SlugField(max_length=64, db_index=True)
    provider = models.SlugField(max_length=32, default='heuristic')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUCCESS)
    request_payload = models.JSONField(default=dict, blank=True)
    response_payload = models.JSONField(default=dict, blank=True)
    token_estimate = models.PositiveIntegerField(default=0)
    cost_estimate = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        actor = self.user_id or self.session_key or 'anonymous'
        return f'{actor}:{self.feature}:{self.status}'

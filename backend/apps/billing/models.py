from django.conf import settings
from django.db import models


class Subscription(models.Model):
    """Canonical subscription record synced from Stripe webhooks."""

    class Tier(models.TextChoices):
        FREE = 'free', 'Free'
        STARTER = 'starter', 'Starter'
        PRO = 'pro', 'Pro'

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        TRIALING = 'trialing', 'Trialing'
        PAST_DUE = 'past_due', 'Past due'
        CANCELED = 'canceled', 'Canceled'
        INCOMPLETE = 'incomplete', 'Incomplete'

    class Interval(models.TextChoices):
        MONTH = 'month', 'Month'
        YEAR = 'year', 'Year'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscription')
    tier = models.CharField(max_length=20, choices=Tier.choices, default=Tier.FREE)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    billing_interval = models.CharField(max_length=10, choices=Interval.choices, default=Interval.MONTH)
    stripe_customer_id = models.CharField(max_length=128, blank=True)
    stripe_subscription_id = models.CharField(max_length=128, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    cancel_at_period_end = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['user_id']

    def __str__(self) -> str:
        return f'{self.user_id}:{self.tier}:{self.status}'

from django.conf import settings
from django.db import models

from apps.portfolios.models import Portfolio


class Domain(models.Model):
    """Custom domain assignment for a published portfolio."""

    class Status(models.TextChoices):
        PENDING_DNS = 'pending_dns', 'Pending DNS'
        VERIFYING = 'verifying', 'Verifying'
        ACTIVE = 'active', 'Active'
        MISCONFIGURED = 'misconfigured', 'Misconfigured'
        DISABLED = 'disabled', 'Disabled'

    class VerificationMethod(models.TextChoices):
        CNAME = 'cname', 'CNAME'

    class SslStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACTIVE = 'active', 'Active'
        ERROR = 'error', 'Error'

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='domains')
    portfolio = models.ForeignKey(Portfolio, null=True, blank=True, on_delete=models.SET_NULL, related_name='domains')
    hostname = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING_DNS)
    verification_method = models.CharField(max_length=20, choices=VerificationMethod.choices, default=VerificationMethod.CNAME)
    verification_token = models.CharField(max_length=128, blank=True)
    ssl_status = models.CharField(max_length=20, choices=SslStatus.choices, default=SslStatus.PENDING)
    cname_target = models.CharField(max_length=255, default='domains.grooya.app')
    verified_at = models.DateTimeField(null=True, blank=True)
    last_checked_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['hostname']

    def __str__(self) -> str:
        return self.hostname

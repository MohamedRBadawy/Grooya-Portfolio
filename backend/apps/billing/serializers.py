from rest_framework import serializers

from apps.billing.models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = [
            'tier',
            'status',
            'billing_interval',
            'current_period_end',
            'cancel_at_period_end',
            'updated_at',
        ]

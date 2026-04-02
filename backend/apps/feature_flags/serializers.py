from rest_framework import serializers

from apps.feature_flags.models import FeatureFlag


class FeatureFlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureFlag
        fields = ['key', 'enabled', 'description', 'updated_at']

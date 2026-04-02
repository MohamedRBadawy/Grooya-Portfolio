from rest_framework import serializers

from apps.domains.models import Domain


class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = [
            'id',
            'portfolio',
            'hostname',
            'status',
            'verification_method',
            'verification_token',
            'ssl_status',
            'cname_target',
            'verified_at',
            'last_checked_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'status',
            'verification_method',
            'verification_token',
            'ssl_status',
            'cname_target',
            'verified_at',
            'last_checked_at',
            'created_at',
            'updated_at',
        ]

    def create(self, validated_data):
        validated_data.setdefault('verification_token', f'dns-{self.context["request"].user.id}-{validated_data["hostname"]}')
        return super().create(validated_data)

from rest_framework import serializers
from django.shortcuts import get_object_or_404

from apps.leads.models import Lead
from apps.portfolios.models import Portfolio


class LeadSubmissionSerializer(serializers.ModelSerializer):
    portfolio_slug = serializers.SlugField(write_only=True)

    class Meta:
        model = Lead
        fields = ['portfolio_slug', 'name', 'email', 'message', 'metadata', 'created_at']
        read_only_fields = ['created_at']

    def create(self, validated_data):
        portfolio_slug = validated_data.pop('portfolio_slug')
        portfolio = get_object_or_404(Portfolio, slug=portfolio_slug, status=Portfolio.Status.PUBLISHED)
        return Lead.objects.create(portfolio=portfolio, **validated_data)

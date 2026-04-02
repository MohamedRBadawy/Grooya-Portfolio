from rest_framework import serializers

from apps.portfolios.models import Portfolio


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = [
            'id',
            'title',
            'slug',
            'track',
            'status',
            'design',
            'pages',
            'assets',
            'seo_title',
            'seo_description',
            'published_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PublicPortfolioSerializer(PortfolioSerializer):
    """Public payload that includes the owner's renderable catalog data."""

    project_catalog = serializers.SerializerMethodField()
    skill_catalog = serializers.SerializerMethodField()

    class Meta(PortfolioSerializer.Meta):
        fields = [*PortfolioSerializer.Meta.fields, 'project_catalog', 'skill_catalog']

    def get_project_catalog(self, obj: Portfolio):
        profile = getattr(obj.owner, 'profile', None)
        return profile.project_catalog if profile else []

    def get_skill_catalog(self, obj: Portfolio):
        profile = getattr(obj.owner, 'profile', None)
        return profile.skill_catalog if profile else []

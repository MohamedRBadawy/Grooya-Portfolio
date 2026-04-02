from rest_framework import serializers


class HeroSuggestionSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    title = serializers.CharField(max_length=120)
    track = serializers.CharField(max_length=32, required=False, allow_blank=True)
    current_headline = serializers.CharField(required=False, allow_blank=True)
    current_subheadline = serializers.CharField(required=False, allow_blank=True)
    audience = serializers.CharField(required=False, allow_blank=True)


class AboutSuggestionSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    title = serializers.CharField(max_length=120)
    track = serializers.CharField(max_length=32, required=False, allow_blank=True)
    existing_content = serializers.CharField(required=False, allow_blank=True)
    audience = serializers.CharField(required=False, allow_blank=True)


class ProjectSuggestionSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=160)
    technologies = serializers.CharField(required=False, allow_blank=True)
    existing_description = serializers.CharField(required=False, allow_blank=True)
    track = serializers.CharField(required=False, allow_blank=True)


class ExperienceSuggestionSerializer(serializers.Serializer):
    title = serializers.CharField(required=False, allow_blank=True)
    company = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField()


class DesignSuggestionSerializer(serializers.Serializer):
    user_title = serializers.CharField(max_length=120)


class SectionSuggestionSerializer(serializers.Serializer):
    goal = serializers.CharField(required=False, allow_blank=True)
    role = serializers.CharField(required=False, allow_blank=True)
    track = serializers.CharField(required=False, allow_blank=True)
    existing_blocks = serializers.ListField(child=serializers.CharField(max_length=32))


class PortfolioReviewSerializer(serializers.Serializer):
    portfolio = serializers.JSONField()
    user = serializers.JSONField(required=False)


class ResumeFromPortfolioSerializer(serializers.Serializer):
    portfolio = serializers.JSONField()
    user = serializers.JSONField()
    all_projects = serializers.ListField(child=serializers.JSONField(), required=False)
    all_skills = serializers.ListField(child=serializers.JSONField(), required=False)


class ResumeForJobSerializer(serializers.Serializer):
    resume = serializers.JSONField()
    job_description = serializers.CharField()

"""Serializers for backend-owned authentication and profile flows."""

from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(trim_whitespace=False)


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, trim_whitespace=False)
    title = serializers.CharField(max_length=120, required=False, allow_blank=True)


class ProfileUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150, required=False)
    email = serializers.EmailField(required=False)
    title = serializers.CharField(max_length=120, required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    avatar_url = serializers.URLField(required=False, allow_blank=True)
    project_catalog = serializers.ListField(child=serializers.DictField(), required=False)
    skill_catalog = serializers.ListField(child=serializers.DictField(), required=False)

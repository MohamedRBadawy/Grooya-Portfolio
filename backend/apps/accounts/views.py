"""Account/session endpoints that power the production auth bootstrap."""

from __future__ import annotations

from urllib.parse import quote

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import AccountProfile
from apps.accounts.serializers import LoginSerializer, ProfileUpdateSerializer, RegisterSerializer
from apps.ai.services import get_ai_snapshot, get_feature_flags
from apps.billing.models import Subscription

User = get_user_model()


def build_default_avatar_url(name: str) -> str:
    """Return a deterministic avatar for accounts that have not uploaded one."""

    safe_name = quote(name or 'Grooya User')
    return f'https://ui-avatars.com/api/?name={safe_name}&background=0f766e&color=ffffff'


def split_name(name: str) -> tuple[str, str]:
    parts = [part for part in name.strip().split() if part]
    if not parts:
        return '', ''
    if len(parts) == 1:
        return parts[0], ''
    return parts[0], ' '.join(parts[1:])


def ensure_account_records(user: User) -> tuple[AccountProfile, Subscription]:
    """Ensure the user has the profile/subscription rows expected by the app."""

    full_name = user.get_full_name() or user.get_username() or user.email
    profile, profile_created = AccountProfile.objects.get_or_create(
        user=user,
        defaults={
            'title': 'Professional Portfolio Owner',
            'bio': 'Tell your story, showcase your work, and win better opportunities with Grooya.',
            'avatar_url': build_default_avatar_url(full_name),
            'role': AccountProfile.Role.ADMIN if user.is_staff or user.is_superuser else AccountProfile.Role.USER,
        },
    )
    if profile_created and not profile.avatar_url:
        profile.avatar_url = build_default_avatar_url(full_name)
        profile.save(update_fields=['avatar_url'])

    subscription, _ = Subscription.objects.get_or_create(user=user)
    return profile, subscription


def bootstrap_dev_demo_account() -> None:
    """Create a local demo account so the dev environment stays usable."""

    if not settings.DEBUG:
        return

    email = 'admin@Grooya.com'
    user = User.objects.filter(email__iexact=email).first()
    if user is None:
        user = User.objects.create_user(
            username='grooya-admin',
            email=email,
            password='Password123',
            first_name='Grooya',
            last_name='Admin',
            is_staff=True,
            is_superuser=True,
        )

    profile, subscription = ensure_account_records(user)
    updated_fields: list[str] = []

    if profile.title != 'Platform Administrator':
        profile.title = 'Platform Administrator'
        updated_fields.append('title')
    if profile.role != AccountProfile.Role.ADMIN:
        profile.role = AccountProfile.Role.ADMIN
        updated_fields.append('role')
    if not profile.avatar_url:
        profile.avatar_url = build_default_avatar_url(user.get_full_name() or user.email)
        updated_fields.append('avatar_url')
    if updated_fields:
        profile.save(update_fields=updated_fields)

    if subscription.tier != Subscription.Tier.PRO or subscription.status != Subscription.Status.ACTIVE:
        subscription.tier = Subscription.Tier.PRO
        subscription.status = Subscription.Status.ACTIVE
        subscription.save(update_fields=['tier', 'status', 'updated_at'])


def resolve_user_from_email(email: str) -> User | None:
    """Support email-first login on top of Django's username-based auth model."""

    return User.objects.filter(email__iexact=email).order_by('id').first()


def serialize_subscription(subscription: Subscription, ai_snapshot: dict) -> dict:
    """Normalize subscription data into the shape the React app expects."""

    ai_allowances = ai_snapshot.get('allowanceByFeature', {})
    text_remaining = sum(
        bucket.get('remaining', 0)
        for feature, bucket in ai_allowances.items()
        if feature != 'imageGeneration' and bucket.get('enabled', True)
    )
    image_remaining = ai_allowances.get('imageGeneration', {}).get('remaining', 0)

    status_value = 'trial' if subscription.status == Subscription.Status.TRIALING else subscription.status
    return {
        'tier': subscription.tier,
        'status': status_value,
        'renewsAt': int(subscription.current_period_end.timestamp() * 1000) if subscription.current_period_end else None,
        'freeFeaturesUsed': {},
        'credits': {
            'text': text_remaining,
            'image': image_remaining,
        },
        'ai': ai_snapshot,
    }


def serialize_user(user: User, profile: AccountProfile, subscription: Subscription, ai_snapshot: dict) -> dict:
    return {
        'id': str(user.id),
        'email': user.email,
        'name': user.get_full_name() or user.get_username(),
        'title': profile.title,
        'bio': profile.bio,
        'avatarUrl': profile.avatar_url or build_default_avatar_url(user.get_full_name() or user.email),
        'role': profile.role,
        'subscription': serialize_subscription(subscription, ai_snapshot),
        'oneTimePurchases': [],
    }


def build_session_payload(request) -> dict:
    feature_flags = get_feature_flags()
    ai_snapshot = get_ai_snapshot(request)
    payload = {
        'authenticated': False,
        'user': None,
        'feature_flags': feature_flags,
        'ai': ai_snapshot,
        'catalog': {
            'projects': [],
            'skills': [],
        },
    }

    if not request.user.is_authenticated:
        return payload

    profile, subscription = ensure_account_records(request.user)
    payload.update(
        {
            'authenticated': True,
            'user': serialize_user(request.user, profile, subscription, ai_snapshot),
            'catalog': {
                'projects': profile.project_catalog,
                'skills': profile.skill_catalog,
            },
        }
    )
    return payload


@method_decorator(ensure_csrf_cookie, name='dispatch')
class SessionStatusView(APIView):
    """Expose the current session, feature flags, and lightweight user catalog."""

    permission_classes = [AllowAny]

    def get(self, request):
        bootstrap_dev_demo_account()
        get_token(request)
        return Response(build_session_payload(request))


class LoginView(APIView):
    """Create a Django session from an email/password login."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        resolved_user = resolve_user_from_email(email)
        username = resolved_user.username if resolved_user else email
        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response(
                {'detail': 'Invalid email or password.', 'code': 'invalid_credentials'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)
        get_token(request)
        ensure_account_records(user)
        return Response(build_session_payload(request))


class RegisterView(APIView):
    """Create a new account and immediately establish a logged-in session."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        name = serializer.validated_data['name'].strip()
        email = serializer.validated_data['email'].strip().lower()
        password = serializer.validated_data['password']
        title = serializer.validated_data.get('title', '').strip()

        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {'detail': 'An account with this email already exists.', 'code': 'email_taken'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        first_name, last_name = split_name(name)
        base_username = email.split('@', 1)[0] or 'grooya-user'
        username = base_username
        suffix = 1
        while User.objects.filter(username=username).exists():
            suffix += 1
            username = f'{base_username}-{suffix}'

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        profile, subscription = ensure_account_records(user)

        profile.title = title or profile.title or 'Professional Portfolio Owner'
        profile.bio = profile.bio or 'Tell your story, showcase your work, and win better opportunities with Grooya.'
        profile.avatar_url = profile.avatar_url or build_default_avatar_url(name or email)
        profile.save(update_fields=['title', 'bio', 'avatar_url', 'updated_at'])

        subscription.tier = Subscription.Tier.FREE
        subscription.status = Subscription.Status.ACTIVE
        subscription.save(update_fields=['tier', 'status', 'updated_at'])

        login(request, user)
        get_token(request)
        return Response(build_session_payload(request), status=status.HTTP_201_CREATED)


class LogoutView(APIView):
    """Destroy the current Django session."""

    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        get_token(request)
        return Response(build_session_payload(request))


class ProfileView(APIView):
    """Read and update profile fields that the React app depends on."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(build_session_payload(request))

    def put(self, request):
        serializer = ProfileUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile, subscription = ensure_account_records(request.user)
        payload = serializer.validated_data

        if 'email' in payload:
            email = payload['email'].strip().lower()
            existing = User.objects.filter(email__iexact=email).exclude(id=request.user.id)
            if existing.exists():
                return Response(
                    {'detail': 'That email address is already in use.', 'code': 'email_taken'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            request.user.email = email

        if 'name' in payload:
            first_name, last_name = split_name(payload['name'])
            request.user.first_name = first_name
            request.user.last_name = last_name

        if {'email', 'name'} & payload.keys():
            request.user.save(update_fields=['email', 'first_name', 'last_name'])

        profile_fields: list[str] = []
        if 'title' in payload:
            profile.title = payload['title']
            profile_fields.append('title')
        if 'bio' in payload:
            profile.bio = payload['bio']
            profile_fields.append('bio')
        if 'avatar_url' in payload:
            profile.avatar_url = payload['avatar_url']
            profile_fields.append('avatar_url')
        if 'project_catalog' in payload:
            profile.project_catalog = payload['project_catalog']
            profile_fields.append('project_catalog')
        if 'skill_catalog' in payload:
            profile.skill_catalog = payload['skill_catalog']
            profile_fields.append('skill_catalog')
        if profile_fields:
            profile.save(update_fields=[*profile_fields, 'updated_at'])

        get_token(request)
        ai_snapshot = get_ai_snapshot(request)
        return Response(
            {
                'user': serialize_user(request.user, profile, subscription, ai_snapshot),
                'catalog': {
                    'projects': profile.project_catalog,
                    'skills': profile.skill_catalog,
                },
                'feature_flags': get_feature_flags(),
                'ai': ai_snapshot,
            }
        )

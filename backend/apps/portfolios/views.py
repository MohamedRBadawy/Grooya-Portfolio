import hashlib

from rest_framework import viewsets
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.analytics.models import PortfolioViewEvent
from apps.portfolios.models import Portfolio
from apps.portfolios.serializers import PortfolioSerializer, PublicPortfolioSerializer


class PortfolioViewSet(viewsets.ModelViewSet):
    """Authenticated CRUD for the current user's portfolios."""

    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Portfolio.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PublicPortfolioDetailView(RetrieveAPIView):
    """Public read endpoint used for published portfolio rendering."""

    serializer_class = PublicPortfolioSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Portfolio.objects.filter(status=Portfolio.Status.PUBLISHED)

    def retrieve(self, request, *args, **kwargs):
        portfolio = self.get_object()
        PortfolioViewEvent.objects.create(
            portfolio=portfolio,
            path=request.get_full_path()[:255],
            visitor_id=request.headers.get('X-Grooya-Visitor', '')[:128],
            referrer=request.headers.get('Referer', '')[:255],
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:2000],
            ip_hash=hashlib.sha256((request.META.get('REMOTE_ADDR') or '').encode('utf-8')).hexdigest()
            if request.META.get('REMOTE_ADDR')
            else '',
        )
        serializer = self.get_serializer(portfolio)
        return Response(serializer.data)

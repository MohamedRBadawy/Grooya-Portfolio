from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.domains.models import Domain
from apps.domains.serializers import DomainSerializer


class DomainViewSet(viewsets.ModelViewSet):
    """Manage the current user's custom domain assignments."""

    serializer_class = DomainSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Domain.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

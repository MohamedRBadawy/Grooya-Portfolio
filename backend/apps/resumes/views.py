from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.resumes.models import Resume
from apps.resumes.serializers import ResumeSerializer


class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

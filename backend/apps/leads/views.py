from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny

from apps.leads.serializers import LeadSubmissionSerializer


class LeadCreateView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = LeadSubmissionSerializer

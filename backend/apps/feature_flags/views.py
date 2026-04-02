from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from apps.feature_flags.models import FeatureFlag
from apps.feature_flags.serializers import FeatureFlagSerializer


class FeatureFlagListView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = FeatureFlag.objects.all()
    serializer_class = FeatureFlagSerializer

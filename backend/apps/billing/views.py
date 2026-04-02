from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.billing.models import Subscription
from apps.billing.serializers import SubscriptionSerializer


class BillingOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        subscription, _ = Subscription.objects.get_or_create(user=request.user)
        return Response(SubscriptionSerializer(subscription).data)


class CheckoutStubView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response(
            {'detail': 'Stripe checkout session creation will be implemented in the billing app service layer.'},
            status=status.HTTP_501_NOT_IMPLEMENTED,
        )


class BillingPortalStubView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response(
            {'detail': 'Stripe billing portal creation will be implemented in the billing app service layer.'},
            status=status.HTTP_501_NOT_IMPLEMENTED,
        )

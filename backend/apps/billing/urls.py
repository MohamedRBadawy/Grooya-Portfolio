from django.urls import path

from apps.billing.views import BillingOverviewView, BillingPortalStubView, CheckoutStubView

urlpatterns = [
    path('subscription/', BillingOverviewView.as_view(), name='billing-overview'),
    path('checkout/', CheckoutStubView.as_view(), name='billing-checkout'),
    path('portal/', BillingPortalStubView.as_view(), name='billing-portal'),
]

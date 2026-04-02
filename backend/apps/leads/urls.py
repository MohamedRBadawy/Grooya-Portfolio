from django.urls import path

from apps.leads.views import LeadCreateView

urlpatterns = [
    path('', LeadCreateView.as_view(), name='lead-create'),
]

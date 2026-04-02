"""API routing for backend application modules."""

from django.urls import include, path

urlpatterns = [
    path('ai/', include('apps.ai.urls')),
    path('auth/', include('apps.accounts.urls')),
    path('', include('apps.portfolios.urls')),
    path('billing/', include('apps.billing.urls')),
    path('analytics/', include('apps.analytics.urls')),
    path('domains/', include('apps.domains.urls')),
    path('flags/', include('apps.feature_flags.urls')),
    path('leads/', include('apps.leads.urls')),
    path('resumes/', include('apps.resumes.urls')),
]

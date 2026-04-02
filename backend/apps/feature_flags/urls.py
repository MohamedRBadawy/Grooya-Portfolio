from django.urls import path

from apps.feature_flags.views import FeatureFlagListView

urlpatterns = [
    path('', FeatureFlagListView.as_view(), name='feature-flag-list'),
]

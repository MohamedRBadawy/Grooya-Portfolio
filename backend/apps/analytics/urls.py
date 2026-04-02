from django.urls import path

from apps.analytics.views import PortfolioAnalyticsView

urlpatterns = [
    path('portfolio/<int:portfolio_id>/', PortfolioAnalyticsView.as_view(), name='portfolio-analytics'),
]

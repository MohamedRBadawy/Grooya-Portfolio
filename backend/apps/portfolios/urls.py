from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.portfolios.views import PortfolioViewSet, PublicPortfolioDetailView

router = DefaultRouter()
router.register('portfolios', PortfolioViewSet, basename='portfolio')

urlpatterns = [
    path('public/portfolios/<slug:slug>/', PublicPortfolioDetailView.as_view(), name='public-portfolio-detail'),
]

urlpatterns += router.urls

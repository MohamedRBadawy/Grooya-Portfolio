from rest_framework.routers import DefaultRouter

from apps.domains.views import DomainViewSet

router = DefaultRouter()
router.register('', DomainViewSet, basename='domain')

urlpatterns = router.urls

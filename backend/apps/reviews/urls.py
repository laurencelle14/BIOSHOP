from rest_framework.routers import DefaultRouter
from .views import ReviewViewset

router = DefaultRouter()
router.register(r'reviews', ReviewViewset, basename='review')


urlpatterns = router.urls
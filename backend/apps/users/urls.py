from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RegisterView, UserProfileViewSet, AddressViewSet

router = DefaultRouter()
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'addresses', AddressViewSet, basename='address')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
] + router.urls
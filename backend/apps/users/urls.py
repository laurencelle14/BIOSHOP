from django.urls import path
from .views import RegisterView, UserProfileView, AddressView, current_user

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', current_user, name='current-user'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('addresses/', AddressView.as_view(), name='address'),
]
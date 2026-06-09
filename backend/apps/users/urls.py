from django.urls import path
from .views import RegisterView, UserProfileView, AddressView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name= 'user-Profile'),
    path('addresses/', AddressView.as_view(), name= 'address'),
]

from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .models import UserProfile, Address
from .serializers import RegisterSerializer, UserProfileSerializer, AddressSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class UserProfileView(generics.RetrieveAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class AddressView(generics.ListCreateAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
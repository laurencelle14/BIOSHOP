from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from .models import UserProfile, Address
from .serializers import RegisterSerializer, UserProfileSerializer, AddressSerializer
from rest_framework.response import Response



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    })
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
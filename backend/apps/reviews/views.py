from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Review
from .serializers import ReviewSerializer


class ReviewViewset(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewSerializer
    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)
    



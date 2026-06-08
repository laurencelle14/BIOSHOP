from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem, Order, OrderItem
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer, OrderItemSerializer
from .permissions import IsOrderOwner


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated, IsOrderOwner]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated, IsOrderOwner]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsOrderOwner]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated, IsOrderOwner]

    def get_queryset(self):
        return OrderItem.objects.filter(order__user=self.request.user)
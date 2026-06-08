from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem

class CartSerializer(serializers.ModelSerializer):
    class Meta :
        model = Cart
        fields = ['user', 'created_at']

class CartItemSerializer(serializers.ModelSerializer):
    class Meta :
        model =CartItem
        fields = ['cart', 'product', 'quantity'] 

class OrderSerializer(serializers.ModelSerializer):
    class Meta :
        model = Order
        fields = ['user', 'address', 'status', 'total', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['order', 'product', 'quantity', 'price_at_purchase']
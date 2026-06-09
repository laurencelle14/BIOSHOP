from rest_framework import serializers
from .models import Order, OrderItem
from apps.users.models import Address

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price_at_purchase']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)
    address = serializers.DictField(write_only=True)

    class Meta:
        model = Order
        fields = ['id', 'status', 'total', 'created_at', 'items', 'address']
        read_only_fields = ['id', 'status', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        address_data = validated_data.pop('address')

        # Créer ou récupérer l'adresse
        address, _ = Address.objects.get_or_create(
            user=validated_data['user'],
            street=address_data.get('street', ''),
            city=address_data.get('city', ''),
            defaults={
                'postal_code': address_data.get('postal_code', ''),
                'country': address_data.get('country', '')
            }
        )

        order = Order.objects.create(address=address, **validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order
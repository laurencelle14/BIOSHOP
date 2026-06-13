from rest_framework import serializers
from apps.products.models import Product
from .models import Order, OrderItem, Address


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['product', 'product_name', 'product_image', 'quantity', 'price_at_purchase']

    def get_product_image(self, obj):
        images = obj.product.productimage_set.filter(is_main=True).first()
        if images:
            return f"http://localhost:8000{images.image.url}"
        return None


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    items_write = serializers.ListField(
        write_only=True,
        child=serializers.DictField(),
        required=False
    )
    address = serializers.DictField(write_only=True)

    class Meta:
        model = Order
        fields = ['id', 'status', 'total', 'created_at', 'items', 'items_write', 'address']
        read_only_fields = ['id', 'status', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items_write', [])
        address_data = validated_data.pop('address')

        address, _ = Address.objects.get_or_create(
            user=validated_data['user'],
            street=address_data.get('street', ''),
            city=address_data.get('city', ''),
            defaults={
                'full_name': address_data.get('full_name', ''),
                'phone': address_data.get('phone', ''),
                'postal_code': address_data.get('postal_code', ''),
                'country': address_data.get('country', 'France')
            }
        )

        order = Order.objects.create(address=address, **validated_data)

        for item_data in items_data:
            product_id = item_data.get('product')
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                continue
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item_data.get('quantity', 1),
                price_at_purchase=item_data.get('price_at_purchase', 0)
            )
             # Décrémenter le stock 🔥
            product.stock -= int(item_data.get('quantity', 1))
            product.stock = max(0, product.stock)  # jamais en dessous de 0
            product.save()
        return order
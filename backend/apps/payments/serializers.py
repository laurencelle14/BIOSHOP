from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'stripe_payment_intent_id', 'amount', 'status', 'created_at']
        read_only_fields = ['stripe_payment_intent_id', 'status', 'created_at']
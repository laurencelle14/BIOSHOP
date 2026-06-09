import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Payment
from apps.orders.models import Order

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreatePaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Commande introuvable'}, status=status.HTTP_404_NOT_FOUND)

        # Créer le PaymentIntent Stripe
        intent = stripe.PaymentIntent.create(
            amount=int(order.total * 100),  # Stripe utilise les centimes
            currency='eur',
            metadata={'order_id': order.id}
        )

        # Sauvegarder le paiement
        Payment.objects.create(
            order=order,
            stripe_payment_intent_id=intent.id,
            amount=order.total,
            status='pending'
        )

        return Response({
            'client_secret': intent.client_secret
        })


class PaymentWebhookView(APIView):
    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if event['type'] == 'payment_intent.succeeded':
            intent = event['data']['object']
            Payment.objects.filter(
                stripe_payment_intent_id=intent['id']
            ).update(status='succeeded')

        return Response({'status': 'ok'})
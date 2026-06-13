import stripe
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Payment
from apps.orders.models import Order

stripe.api_key = settings.STRIPE_SECRET_KEY


def send_payment_confirmation(order):
    """Email de confirmation de paiement"""
    try:
        items_text = '\n'.join([
            f"- {item.product.name} x{item.quantity} — {item.price_at_purchase} €"
            for item in order.items.all()
        ])
        send_mail(
            subject=f"💳 Paiement reçu — Commande #{order.id} — Body's Caprice",
            message=f"""Bonjour {order.user.first_name or order.user.email},

Votre paiement a bien été reçu ! 🎉

Récapitulatif de votre commande #{order.id} :

{items_text}

Total payé : {order.total} €

Nous préparons votre commande et vous tiendrons informé(e) de son expédition.

Merci pour votre confiance !

— L'équipe Body's Caprice by E.M.A""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Erreur envoi email paiement: {e}")


class CreatePaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Commande introuvable'}, status=status.HTTP_404_NOT_FOUND)

        intent = stripe.PaymentIntent.create(
            amount=int(order.total * 100),
            currency='eur',
            metadata={'order_id': order.id}
        )

        Payment.objects.create(
            order=order,
            stripe_payment_intent_id=intent.id,
            amount=order.total,
            status='pending'
        )

        return Response({'client_secret': intent.client_secret})


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

            # Email de confirmation de paiement
            order_id = intent.get('metadata', {}).get('order_id')
            if order_id:
                try:
                    order = Order.objects.get(id=order_id)
                    order.status = 'confirmed'
                    order.save()
                    send_payment_confirmation(order)
                except Order.DoesNotExist:
                    pass

        return Response({'status': 'ok'})
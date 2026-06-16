import uuid
import requests
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import Payment
from apps.orders.models import Order


def send_payment_confirmation(order):
    try:
        items_text = '\n'.join([
            f"- {item.product.name} x{item.quantity} — {item.price_at_purchase} FCFA"
            for item in order.items.all()
        ])
        send_mail(
            subject=f"💳 Paiement reçu — Commande #{order.id} — Body's Caprice",
            message=f"""Bonjour {order.user.first_name or order.user.email},

Votre paiement a bien été reçu ! 🎉

Récapitulatif de votre commande #{order.id} :

{items_text}

Total payé : {order.total} FCFA

Nous préparons votre commande et vous tiendrons informé(e) de son expédition.

Merci pour votre confiance !

— L'équipe Body's Caprice by E.M.A""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Erreur envoi email paiement: {e}")


class InitiatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Commande introuvable'}, status=status.HTTP_404_NOT_FOUND)

        transaction_id = str(uuid.uuid4())

        Payment.objects.create(
            order=order,
            cinetpay_transaction_id=transaction_id,
            amount=order.total,
            status='pending'
        )

        payload = {
            "apikey": settings.CINETPAY_API_KEY,
            "site_id": settings.CINETPAY_SITE_ID,
            "transaction_id": transaction_id,
            "amount": int(order.total),
            "currency": "XOF",
            "description": f"Commande #{order.id} — Body's Caprice",
            "return_url": f"{settings.FRONTEND_URL}/order-success",
            "notify_url": f"{settings.BACKEND_URL}/api/payments/notify/",
            "customer_name": order.user.first_name or "Client",
            "customer_surname": order.user.last_name or "",
            "customer_email": order.user.email,
            "customer_phone_number": "",
            "customer_address": "",
            "customer_city": "",
            "customer_country": "CI",
            "customer_state": "CI",
            "customer_zip_code": "",
            "channels": "ALL",
            "lang": "fr",
        }

        try:
            res = requests.post(
                "https://api-checkout.cinetpay.com/v2/payment",
                json=payload
            )
            data = res.json()

            if data.get("code") == "201":
                return Response({
                    "payment_url": data["data"]["payment_url"],
                    "transaction_id": transaction_id
                })
            else:
                return Response(
                    {"error": data.get("message", "Erreur CinetPay")},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CinetPayNotifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        transaction_id = request.data.get("cpm_trans_id")
        trans_status = request.data.get("cpm_result")

        try:
            payment = Payment.objects.get(cinetpay_transaction_id=transaction_id)
        except Payment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if trans_status == "00":
            payment.status = "succeeded"
            payment.save()
            order = payment.order
            order.status = "confirmed"
            order.save()
            send_payment_confirmation(order)
        else:
            payment.status = "failed"
            payment.save()

        return Response({"status": "ok"})
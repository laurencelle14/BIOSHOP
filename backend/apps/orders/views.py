from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Order, OrderItem
from .serializers import OrderSerializer


def send_order_confirmation(order):
    """Email de confirmation de commande au client"""
    try:
        items_text = '\n'.join([
            f"- {item.product.name} x{item.quantity} — {item.price_at_purchase} €"
            for item in order.items.all()
        ])
        send_mail(
            subject=f"✅ Commande #{order.id} confirmée — Body's Caprice",
            message=f"""Bonjour {order.user.first_name or order.user.email},

Merci pour votre commande ! Voici le récapitulatif :

{items_text}

Total : {order.total} €
Statut : En attente de traitement

Nous vous tiendrons informé(e) de l'avancement de votre commande.

— L'équipe Body's Caprice by E.M.A""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Erreur envoi email confirmation: {e}")


def send_order_status_update(order):
    """Email de mise à jour de statut au client"""
    status_messages = {
        'confirmed': ('🎉 Commande confirmée', 'Votre commande a été confirmée et est en cours de préparation.'),
        'shipped': ('📦 Commande expédiée', 'Votre commande est en route ! Elle sera livrée sous peu.'),
        'delivered': ('✅ Commande livrée', 'Votre commande a été livrée. Nous espérons que vous êtes satisfait(e) !'),
        'cancelled': ('❌ Commande annulée', 'Votre commande a été annulée. Contactez-nous pour plus d\'informations.'),
        'pending': ('⏳ Commande en attente', 'Votre commande est en attente de traitement.'),
    }

    subject_prefix, message_body = status_messages.get(
        order.status,
        ('📋 Mise à jour commande', 'Le statut de votre commande a été mis à jour.')
    )

    try:
        send_mail(
            subject=f"{subject_prefix} #{order.id} — Body's Caprice",
            message=f"""Bonjour {order.user.first_name or order.user.email},

{message_body}

Commande #{order.id}
Total : {order.total} €
Statut actuel : {order.get_status_display()}

Merci de votre confiance.

— L'équipe Body's Caprice by E.M.A""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Erreur envoi email statut: {e}")


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        # Email de confirmation au client
        send_order_confirmation(order)


class AdminOrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Order.objects.all().order_by('-created_at')

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_status = instance.status
        response = super().partial_update(request, *args, **kwargs)
        instance.refresh_from_db()

        # Email si le statut a changé
        if old_status != instance.status:
            send_order_status_update(instance)

        return response
from django.db import models
from django.contrib.auth.models import User
from apps.orders.models import Order

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('succeeded', 'Réussi'),
        ('failed', 'Échoué'),
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    stripe_payment_intent_id = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.stripe_payment_intent_id} - {self.status}"
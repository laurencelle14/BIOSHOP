from django.db import models
from django.contrib.auth.models import User
from apps.products.models import Product

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    RATING_CHOICES = [
    (1, '1 étoile'),
    (2, '2 étoiles'),
    (3, '3 étoiles'),
    (4, '4 étoiles'),
    (5, '5 étoiles'),
    ]
    rating = models.IntegerField(choices=RATING_CHOICES, default=1)
    comment = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ['user', 'product'] # Un user ne peut pas avoir deux avis sur le même product
        
        ordering = ['-created_at']  # les plus récents en premier

        verbose_name = 'Avis'
        verbose_name_plural = 'Avis'


# Create your models here.

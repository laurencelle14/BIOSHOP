from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # Un seul profil peut être lié à un seul utilisateur
    phone = models.CharField(max_length=20)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True) # null=True, blank=True car l'avatar est optionnel

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
import pyotp
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .managers import CustomUserManager

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    # Champs OTP
    otp_secret = models.CharField(max_length=32, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    is_otp_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def generate_otp(self):
        """Génère un OTP valable 5 minutes"""
        self.otp_secret = pyotp.random_base32()
        self.otp_created_at = timezone.now()
        self.is_otp_verified = False
        self.save()
        totp = pyotp.TOTP(self.otp_secret, interval=300)
        return totp.now()

    def verify_otp(self, otp_code):
        """Vérifie que le code OTP est valide et pas expiré"""
        if not self.otp_secret or not self.otp_created_at:
            return False
        # Expiration après 5 minutes
        if timezone.now() > self.otp_created_at + timedelta(minutes=5):
            return False
        totp = pyotp.TOTP(self.otp_secret, interval=300)
        return totp.verify(otp_code)
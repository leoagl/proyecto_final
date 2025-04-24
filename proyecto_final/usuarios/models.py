from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    correo_electronico = models.EmailField(unique=True, null=False, blank=False)
    fecha_registro = models.DateField(auto_now_add=True)
    ROL_CHOICES = [
        ('admin', 'Administrador'),
        ('usuario', 'Usuario'),
    ]
    rol = models.CharField(max_length=10, choices=ROL_CHOICES, default='usuario')

    # Campos para MFA
    """mfa_enabled = models.BooleanField(default=False)
    mfa_secret = models.CharField(max_length=32, blank=True, null=True)
    mfa_verified = models.BooleanField(default=False)"""
    mfa_enabled = models.BooleanField(default=False)

    def __str__(self):
        return self.username
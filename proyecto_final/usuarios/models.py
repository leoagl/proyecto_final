from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    correo_electronico = models.EmailField(unique=True)
    fecha_registro = models.DateField(auto_now_add=True)
    ROL_CHOICES = [
        ('admin', 'Administrador'),
        ('usuario', 'Usuario'),
    ]
    rol = models.CharField(max_length=10, choices=ROL_CHOICES, default='usuario')

    def __str__(self):
        return self.username
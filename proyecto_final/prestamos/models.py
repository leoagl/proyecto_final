from django.db import models
from usuarios.models import Usuario
from libros.models import Libro

class Prestamo(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    fecha_prestamo = models.DateField(auto_now_add=True)
    fecha_vencimiento = models.DateField()
    fecha_devolucion = models.DateField(null=True, blank=True)

    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('activo', 'Activo'),
        ('vencido', 'Vencido'),
        ('devuelto', 'Devuelto'),
    ]
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='activo')

    def __str__(self):
        return f"{self.usuario.username} prestó {self.libro.titulo}"
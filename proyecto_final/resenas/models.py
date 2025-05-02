from django.db import models
from django.conf import settings
from libros.models import Libro

class Reseña(models.Model):
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE, related_name='resenas')
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comentario = models.TextField()
    calificacion = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.usuario.username} - {self.libro.titulo} ({self.calificacion}⭐)'

from django.db import models
from usuarios.models import Usuario
from libros.models import Libro

class Resena(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    calificacion = models.PositiveSmallIntegerField()  # Ej: del 1 al 5
    comentario = models.TextField()
    fecha_resena = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Reseña de {self.usuario.username} sobre {self.libro.titulo}"
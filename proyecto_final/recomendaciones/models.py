from django.db import models
from usuarios.models import Usuario
from libros.models import Libro

class Recomendacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    fecha_recomendacion = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.username} recomienda {self.libro.titulo}"
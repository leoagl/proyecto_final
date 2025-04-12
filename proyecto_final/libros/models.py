from django.db import models

class Genero(models.Model):
    nombre_genero = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre_genero

class Libro(models.Model):
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=100)
    editorial = models.CharField(max_length=100)
    año_publicacion = models.PositiveIntegerField()
    ISBN = models.CharField(max_length=13, unique=True)
    disponibilidad = models.BooleanField(default=True)
    genero = models.ForeignKey(Genero, on_delete=models.CASCADE)

    def __str__(self):
        return self.titulo
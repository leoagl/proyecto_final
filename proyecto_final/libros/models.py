from django.db import models
from django.utils.html import mark_safe

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
    existencias = models.PositiveIntegerField(default=1)
    portada = models.ImageField(upload_to='portadas/', null=True, blank=True)
    portada_url = models.URLField(blank=True, null=True)

    def portada_preview(self):
        if self.portada:
            return mark_safe(
                f'<img src="{self.portada.url}" width="120" height="160" style="object-fit: contain; border: 1px solid #ccc;" />')
        elif self.portada_url:  # <--- MUESTRA LA URL SI LA IMAGEN AÚN NO SE HA GUARDADO
            return mark_safe(
                f'<img src="{self.portada_url}" width="120" height="160" style="object-fit: contain; border: 1px solid #ccc;" />')
        return "(Sin portada)"

    portada_preview.short_description = "Vista previa"

    def __str__(self):
        return self.titulo
from django.contrib import admin
from django.conf import settings
from django.utils.html import format_html
import os
from .models import Libro, Genero
from django import forms
from urllib.request import urlretrieve
import requests

# Register your models here.

class LibroAdminForm(forms.ModelForm):
    class Meta:
        model = Libro
        fields = '__all__'

    class Media:
            js = ('js/autocompletar_libro.js',)
    def clean(self):
        cleaned_data = super().clean()
        isbn = cleaned_data.get('ISBN')
        if isbn and Libro.objects.filter(ISBN=isbn).exists():
            raise forms.ValidationError(f"Ya existe un libro con ISBN {isbn}.")
        return cleaned_data

    def save(self, commit=True):
        instance = super().save(commit=False)
        titulo = instance.titulo

        # Llamada a Google Books API
        if titulo:
            res = requests.get('https://www.googleapis.com/books/v1/volumes', params={
                'q': titulo,
                'key': settings.GOOGLE_BOOKS_API_KEY
            })
            data = res.json()
            if 'items' in data:
                info = data['items'][0]['volumeInfo']
                instance.titulo = info.get('title', instance.titulo)
                instance.autor = ", ".join(info.get('authors', []))
                instance.editorial = info.get('publisher', '')
                instance.año_publicacion = int(info.get('publishedDate', '0')[:4])
                instance.ISBN = next((x['identifier'] for x in info.get('industryIdentifiers', []) if x['type'] == 'ISBN_13'), instance.ISBN)

                # Descargar imagen
                imagen_url = info.get('imageLinks', {}).get('thumbnail')
                if imagen_url:
                    img_name = f"{instance.ISBN}.jpg"
                    path = os.path.join(settings.MEDIA_ROOT, "portadas", img_name)
                    # Crea el directorio si no existe
                    os.makedirs(os.path.dirname(path), exist_ok=True)
                    urlretrieve(imagen_url, path)
                    instance.portada.name = f"portadas/{img_name}"

        if commit:
            instance.save()
        return instance

class LibroAdmin(admin.ModelAdmin):
    form = LibroAdminForm
    readonly_fields = ('vista_previa_portada',)
    fields = ('titulo', 'autor', 'editorial', 'año_publicacion', 'ISBN', 'portada', 'vista_previa_portada', 'genero')

    list_display = ('titulo', 'autor', 'editorial', 'año_publicacion', 'miniatura_portada')
    list_display_links = ('titulo',)  # Para que el título sea el enlace a editar

    def vista_previa_portada(self, obj):
        if obj.portada:
            return format_html('<img src="{}" style="max-height: 200px;" />', obj.portada.url)
        return "No hay portada"
    vista_previa_portada.short_description = "Vista previa de portada"

    def miniatura_portada(self, obj):
        if obj.portada:
            return format_html('<img src="{}" style="height: 50px;" />', obj.portada.url)
        return "Sin imagen"
    miniatura_portada.short_description = "Portada"
admin.site.register(Libro, LibroAdmin)
admin.site.register(Genero)
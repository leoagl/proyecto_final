from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import render
from .models import Libro, Genero
import requests
from urllib.parse import quote


def buscar_libro_googlebooks(request):
    titulo = request.GET.get('titulo', '')
    if not titulo:
        return JsonResponse({'error': 'No se proporcionó un título'}, status=400)

    try:
        response = requests.get("https://www.googleapis.com/books/v1/volumes", params={
            "q": titulo,
            "key": settings.GOOGLE_BOOKS_API_KEY
        })
        data = response.json()

        # 🔴 Imprime para depurar
        print("🔍 Resultado completo:", data)

        if 'items' not in data:
            return JsonResponse({'exito': False})

        info = data['items'][0]['volumeInfo']
        resultado = {
            'exito': True,
            'titulo': info.get('title', ''),
            'autor': ", ".join(info.get('authors', [])),
            'editorial': info.get('publisher', ''),
            'año_publicacion': info.get('publishedDate', '')[:4],
            'ISBN': next((x['identifier'] for x in info.get('industryIdentifiers', []) if x['type'] == 'ISBN_13'), ''),
            'portada': info.get('imageLinks', {}).get('thumbnail', ''),
        }
        return JsonResponse(resultado)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def catalogo(request):
    return render(request, 'catalogo.html')

def catalogo(request):
    libros = Libro.objects.all()  # Trae todos los libros
    # Filtros avanzados
    categoria = request.GET.get('categoria')
    autor = request.GET.get('autor')
    anio = request.GET.get('anio')
    disponibilidad = request.GET.get('disponibilidad')
    calificacion = request.GET.get('calificacion')  # Futuro

    if categoria:
        libros = libros.filter(genero_id=categoria)

    if autor:
        libros = libros.filter(autor__icontains=autor)

    if anio:
        libros = libros.filter(año_publicacion=anio)

    if disponibilidad:
        if disponibilidad == 'disponible':
            libros = libros.filter(disponibilidad=True)
        elif disponibilidad == 'no_disponible':
            libros = libros.filter(disponibilidad=False)

    # La parte de calificación la dejaremos lista para después
    # if calificacion:
    #     libros = libros.filter(calificacion__gte=calificacion)

    total_resultados = libros.count()

    generos = Genero.objects.all()  # Para el filtro de categorías

    return render(request, 'libros/catalogo.html', {
        'libros': libros,
        'total_resultados': total_resultados,
        'generos': generos,
    })
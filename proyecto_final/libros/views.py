from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.contrib import messages
from django.db.models import Min, Max, Avg, Count
from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import render, redirect, get_object_or_404
from .models import Libro, Genero
from django.db.models import Q
import requests
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from resenas.forms import ReseñaForm
from urllib.parse import quote


def buscar_libro_googlebooks(request):
    titulo = request.GET.get('titulo', '')
    if not titulo:
        return JsonResponse({'error': 'No se proporcionó un título'}, status=400)

    try:
        response = requests.get(
            "https://www.googleapis.com/books/v1/volumes",
            params={
                "q": titulo,
                "key": settings.GOOGLE_BOOKS_API_KEY,
                "maxResults": 5  # Obtener varios resultados
            }
        )
        data = response.json()

        print("🔍 Resultado completo (varios):", data) # Depuración

        resultados = []
        if 'items' in data:
            for item in data['items']:
                info = item.get('volumeInfo', {})
                resultado = {
                    'id': item.get('id', ''), # Añadir un ID único para cada resultado
                    'titulo': info.get('title', ''),
                    'autor': ", ".join(info.get('authors', [])),
                    'editorial': info.get('publisher', ''),
                    'año_publicacion': info.get('publishedDate', '')[:4] if info.get('publishedDate') else '',
                    'ISBN': next((x['identifier'] for x in info.get('industryIdentifiers', []) if x['type'] == 'ISBN_13'), ''),
                    'portada': info.get('imageLinks', {}).get('thumbnail', ''),
                }
                resultados.append(resultado)

        return JsonResponse({'exito': True, 'resultados': resultados})

    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': f'Error de conexión con la API de Google Books: {str(e)}'}, status=500)
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

    rangos = Libro.objects.aggregate(min_anyo=Min('año_publicacion'), max_anyo=Max('año_publicacion'))
    anyo_min = int(request.GET.get('anyo_min', rangos['min_anyo']))
    anyo_max = int(request.GET.get('anyo_max', rangos['max_anyo']))

    query = request.GET.get('q', '')
    if query:
        libros = libros.filter(
            Q(titulo__icontains=query) |
            Q(autor__icontains=query)
        )

    if categoria:
        libros = libros.filter(genero_id=categoria)

    if autor:
        libros = libros.filter(autor__icontains=autor)

    if anyo_min and anyo_max:
        libros = libros.filter(año_publicacion__range=(anyo_min, anyo_max))

    if disponibilidad:
        if disponibilidad == 'disponible':
            libros = libros.filter(disponibilidad=True)
        elif disponibilidad == 'no_disponible':
            libros = libros.filter(disponibilidad=False)

    # La parte de calificación la dejaremos lista para después
    # if calificacion:
    #     libros = libros.filter(calificacion__gte=calificacion)
    paginator = Paginator(libros, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    autores = Libro.objects.values_list('autor', flat=True).distinct()

    categorias_seleccionadas = request.GET.getlist('categoria')

    total_resultados = libros.count()

    generos = Genero.objects.all()  # Para el filtro de categorías

    return render(request, 'libros/catalogo.html', {
        'libros': page_obj,  # <--- CAMBIA 'libros' a 'page_obj'
        'page_obj': page_obj,
        'total_resultados': total_resultados,
        'generos': generos,
        'categorias_seleccionadas': categorias_seleccionadas,
        'autores': autores,
        'autores_seleccionados': request.GET.getlist('autor'),
        'anyo_min': anyo_min,
        'anyo_max': anyo_max,
        'rango_anyos': rangos,
        'query': query,
    })

def detalle_libro(request, libro_id):
    libro = get_object_or_404(Libro, pk=libro_id)
    todas_las_resenas = libro.resenas.select_related('usuario').order_by('-fecha')
    related_books = obtener_libros_relacionados(libro)

    # Filtrado por calificación para la lista de comentarios
    resenas_queryset = todas_las_resenas
    calificacion_filter = request.GET.get('calificacion_filter')
    if calificacion_filter != 'all' and calificacion_filter in ['5', '4', '3', '2', '1']:
        resenas_queryset = resenas_queryset.filter(calificacion=int(calificacion_filter))

    # Paginación de reseñas
    paginator_resenas = Paginator(resenas_queryset, 5)
    page_resenas = request.GET.get('page_resenas')
    try:
        resenas = paginator_resenas.get_page(page_resenas)
    except PageNotAnInteger:
        resenas = paginator_resenas.page(1)
    except EmptyPage:
        resenas = paginator_resenas.page(paginator_resenas.num_pages)

    promedio_calificacion = libro.resenas.aggregate(avg_calificacion=Avg('calificacion'))['avg_calificacion']
    total_resenas = todas_las_resenas.count() # Usar todas_las_resenas para el total general
    calificacion_counts = libro.resenas.values('calificacion').annotate(count=Count('calificacion')).order_by('-calificacion') # Usar libro.resenas para la distribución general

    # Calcular el porcentaje para cada calificación
    calificacion_percentages = []
    if total_resenas > 0:
        for count_item in calificacion_counts:
            percentage = (count_item['count'] * 100) / total_resenas
            calificacion_percentages.append({'calificacion': count_item['calificacion'], 'percentage': percentage})

    form = ReseñaForm()

    context = {
        'libro': libro,
        'reseñas': resenas,
        'form': form,
        'promedio_calificacion': promedio_calificacion,
        'total_resenas': total_resenas,
        'calificacion_counts': calificacion_counts,
        'calificacion_percentages': calificacion_percentages,
        'related_books': related_books,
    }
    return render(request, 'libros/detalle_libro.html', context)

@login_required
def crear_resena(request, libro_id):
    libro = get_object_or_404(Libro, pk=libro_id)
    if request.method == 'POST':
        form = ReseñaForm(request.POST)
        if form.is_valid():
            resena = form.save(commit=False)
            resena.libro = libro
            resena.usuario = request.user
            resena.save()
            messages.success(request, '¡Tu reseña ha sido publicada!')
            return redirect('detalle_libro', libro_id=libro_id)
        else:
            messages.error(request, 'Hubo un error al enviar tu reseña.')
    else:
        form = ReseñaForm()
    context = {
        'libro': libro,
        'form': form,
    }
    return render(request, 'libros/detalle_libro.html', context)

def obtener_libros_relacionados(libro):
    return Libro.objects.filter(genero=libro.genero).exclude(id=libro.id)[:4]
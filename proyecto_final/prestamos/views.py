from django.db.models import F
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.db import models
from django.views.decorators.csrf import csrf_exempt
from libros.models import Libro
from .models import Prestamo
from django.contrib import messages
from datetime import timedelta, date
from django.views.decorators.http import require_POST


# Create your views here.
def prestamos(request):
    libros_disponibles = Libro.objects.filter(disponibilidad=True)
    prestamos_actuales_count = Prestamo.objects.filter(usuario=request.user, estado__in=['activo', 'pendiente', 'vencido']).count()
    historial_prestamos_count = Prestamo.objects.filter(usuario=request.user, estado='devuelto').count()
    context = {
        'libros_disponibles': libros_disponibles, # Pasar los libros disponibles al contexto
        'prestamos_actuales': Prestamo.objects.filter(usuario=request.user, estado__in=['activo', 'pendiente', 'vencido']).order_by('fecha_devolucion').select_related('libro'),
        'historial_prestamos': Prestamo.objects.filter(usuario=request.user, estado='devuelto').order_by('-fecha_devolucion').select_related('libro'),
        'prestamos_actuales_count': prestamos_actuales_count,
        'historial_prestamos_count': historial_prestamos_count,
    }
    return render(request, 'prestamos.html', context)

@login_required
def solicitar_prestamo(request):
    if request.method == 'POST':
        libros_ids = request.POST.getlist('books')
        fecha_vencimiento_str  = request.POST.get('returnDate')

        libros = Libro.objects.filter(id__in=libros_ids, disponibilidad=True)

        if not libros:
            messages.error(request, 'No se seleccionaron libros disponibles.')
            return redirect('prestamos:prestamos')

        fecha_vencimiento = None
        if fecha_vencimiento_str:
            try:
                fecha_vencimiento  = date.fromisoformat(fecha_vencimiento_str)
            except ValueError:
                messages.error(request, 'Formato de fecha de devolución inválido.')
                return redirect('prestamos:prestamos')
        else:
            messages.error(request, 'Por favor, selecciona una fecha de devolución.')
            return redirect('prestamos:prestamos')

        if fecha_vencimiento and fecha_vencimiento  > date.today() + timedelta(days=30):
            messages.error(request, 'La fecha máxima de préstamo es de 30 días.')
            return redirect('prestamos:prestamos')

        for libro in libros:
            Prestamo.objects.create(libro=libro, usuario=request.user, fecha_vencimiento=fecha_vencimiento)
            libro.existencias = models.F('existencias') - 1
            libro.disponibilidad = False
            libro.save()

        messages.success(request, 'Préstamo(s) solicitado(s) con éxito.')
        return redirect('prestamos:prestamos')
    else:
        libros_disponibles = Libro.objects.filter(disponibilidad=True).values('id', 'titulo', 'autor', 'portada', 'portada_url')
        return JsonResponse({'libros_disponibles': list(libros_disponibles)})

@login_required
def mis_prestamos(request):
    prestamos_actuales = Prestamo.objects.filter(usuario=request.user, estado__in=['activo', 'pendiente', 'vencido']).order_by('fecha_devolucion').select_related('libro')
    historial_prestamos = Prestamo.objects.filter(usuario=request.user, estado='devuelto').order_by(
        '-fecha_devolucion').select_related('libro')
    context = {
        'prestamos_actuales': prestamos_actuales,
        'historial_prestamos': historial_prestamos,
    }
    return render(request, 'prestamos.html', context)


@login_required
def devolver_libro(request, prestamo_id):
    try:
        # Obtener el préstamo activo correspondiente al usuario
        prestamo = get_object_or_404(Prestamo, pk=prestamo_id, usuario=request.user, estado='activo')
        libro = prestamo.libro

        # Actualizar el estado del préstamo y la fecha de devolución real
        prestamo.estado = 'devuelto'
        prestamo.fecha_devolucion = timezone.now().date()
        prestamo.save()

        # Actualizar existencias y disponibilidad del libro
        libro.existencias = F('existencias') + 1  # Usar F para evitar conflictos con la base de datos
        libro.disponibilidad = True  # Marcar como disponible
        libro.save()

        # Mostrar mensaje de éxito
        messages.success(request, f'El libro "{libro.titulo}" ha sido devuelto.')
        return redirect('prestamos:prestamos')  # Redirigir a la vista de préstamos

    except Prestamo.DoesNotExist:
        # Si no se encuentra el préstamo activo
        messages.error(request, 'No se encontró el préstamo activo para este libro.')
        return redirect('prestamos:prestamos')

def libros_seleccionados(request):
    if request.method == 'POST':
        seleccionados_ids = request.POST.getlist('books')
        libros_seleccionados = Libro.objects.filter(id__in=seleccionados_ids)
        return render(request, 'includes/selected_books_list.html', {
            'libros_seleccionados': libros_seleccionados
        })

def actualizar_resumen(request):
    selected_books = []
    selected_book_ids = request.POST.getlist('books')
    if selected_book_ids:
        selected_books = Libro.objects.filter(id__in=selected_book_ids)

    return_date_str = request.POST.get('returnDate')
    return_date = None
    if return_date_str:
        try:
            return_date = date.fromisoformat(return_date_str)
        except ValueError:
            return_date = date.today() + timedelta(days=7) # Fecha por defecto

    today = date.today()

    context = {
        'selected_books': selected_books,
        'return_date': return_date,
        'today': today,
    }
    return render(request, 'includes/loan_summary.html', context)
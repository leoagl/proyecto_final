from django.urls import path
from . import views


urlpatterns = [
    path('solicitar/', views.solicitar_prestamo, name='solicitar_prestamo'),
    path('prestamos/', views.prestamos, name='prestamos'),
    path('devolver/<int:prestamo_id>/', views.devolver_libro, name='devolver_libro'),
    path('mis/', views.mis_prestamos, name='mis_prestamos'),
    path('libros-seleccionados/', views.libros_seleccionados, name='libros_seleccionados'),
    path('actualizar-resumen/', views.actualizar_resumen, name='actualizar_resumen'),
]
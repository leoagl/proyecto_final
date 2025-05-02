from django.urls import path
from .views import buscar_libro_googlebooks
from . import views


urlpatterns = [
    path('api/googlebooks/', buscar_libro_googlebooks, name='buscar_libro_googlebooks'),
    path('catalogo/', views.catalogo, name='catalogo'),
    path('libro/<int:libro_id>/reseña/crear/', views.crear_resena, name='crear_resena'),
    path('libro/<int:libro_id>/', views.detalle_libro, name='detalle_libro'),
]
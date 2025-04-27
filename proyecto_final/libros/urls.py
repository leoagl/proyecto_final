from django.urls import path
from .views import buscar_libro_googlebooks
from . import views


urlpatterns = [
    path('api/googlebooks/', buscar_libro_googlebooks, name='buscar_libro_googlebooks'),
    path('catalogo/', views.catalogo, name='catalogo'),
]
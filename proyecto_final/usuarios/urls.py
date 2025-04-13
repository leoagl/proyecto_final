from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_usuario, name='login'),
    path('registro/', views.registro_usuario, name='registro'),
]
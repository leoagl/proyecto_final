from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView


urlpatterns = [
    path('login/', views.login_usuario, name='login'),
    path('logout/', LogoutView.as_view(next_page='inicio'), name='logout'),
    path('registro/', views.registro_usuario, name='registro'),
    path('admin/mfa/configurar/', views.configurar_mfa, name='configurar_mfa'),
    path('admin/mfa/verificar/', views.verificar_mfa, name='verificar_mfa'),
]
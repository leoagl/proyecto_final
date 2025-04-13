from django.shortcuts import render

# Create your views here.

def login_usuario(request):
    return render(request, 'inicio_sesion.html')

def registro_usuario(request):
    return render(request, 'registro.html')
from io import BytesIO

from django.shortcuts import render
from django_otp.plugins.otp_totp.models import TOTPDevice
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
import qrcode
import base64
from .models import Usuario
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib import messages
from django.contrib.auth.models import User, Group
from django.contrib.auth.hashers import make_password  # Importa make_password

# Create your views here.

def login_usuario(request):
    return render(request, 'inicio_sesion.html')

def registro_usuario(request):
    return render(request, 'registro.html')

@login_required
def configurar_mfa(request):
    if request.user.rol != 'admin':
        return redirect('home')

    device = TOTPDevice.objects.filter(user=request.user, confirmed=True).first()
    if device:
        return redirect('verificar_mfa')

    # Crear dispositivo (si no existe uno no confirmado)
    device, created = TOTPDevice.objects.get_or_create(
        user=request.user,
        defaults={'name': 'Mi MFA', 'confirmed': False}
    )

    # Generar QR
    otp_uri = device.config_url
    qr = qrcode.make(otp_uri)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    qr_base64 = base64.b64encode(buffer.getvalue()).decode()

    # Guardar QR en la sesión para usarlo en verificar_mfa
    request.session['mfa_qr'] = qr_base64
    request.session.save()  # ¡Importante!

    return render(request, 'usuarios/configurar_mfa.html', {
        'qr_base64': qr_base64
    })


@login_required
def verificar_mfa(request):
    device = TOTPDevice.objects.filter(user=request.user, confirmed=False).first()

    if request.method == 'POST':
        otp = request.POST.get('otp')
        if device and device.verify_token(otp):
            device.confirmed = True
            device.save()
            request.session.pop('mfa_qr', None)
            return redirect('/admin/')
        else:
            return render(request, 'usuarios/verificar_mfa.html', {
                'error': 'Código incorrecto. Inténtalo de nuevo.',
                'qr_base64': request.session.get('mfa_qr')  # Mostrar QR si existe
            })

    # Si no hay dispositivo o ya está confirmado, redirigir
    if not device or device.confirmed:
        return redirect('configurar_mfa')

    return render(request, 'usuarios/verificar_mfa.html', {
        'qr_base64': request.session.get('mfa_qr')  # Pasar QR a la plantilla
    })

def registro_usuario(request):
    print("Vista registro_usuario llamada")  # Depuración
    if request.method == 'POST':
        print("Método POST recibido")  # Depuración
        username = request.POST.get('username')
        nombre = request.POST.get('nombre')
        apellido = request.POST.get('apellido')
        correo_electronico = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm-password')

        print(f"Nombre: {nombre}, Apellido: {apellido}, Email: {correo_electronico}") #Depuración

        if password == confirm_password:
            try:
                usuario = Usuario.objects.create_user(
                    username=username,
                    correo_electronico=correo_electronico,
                    first_name=nombre,
                    last_name=apellido,
                    password=password,
                    rol='usuario',
                )
                print("Usuario creado correctamente")  # Depuración

                try:
                    group = Group.objects.get(name='usuario')
                    usuario.groups.add(group)
                    print("Usuario agregado al grupo 'usuario'")  # Depuración
                    return redirect('inicio')
                except Group.DoesNotExist:
                    print("Error: Grupo 'usuario' no encontrado")  # Depuración
                    return render(request, 'usuarios/registro.html', {'error_message': "Grupo 'usuario' no encontrado"})

            except Exception as e:
                error_message = f"Error al crear usuario: {e}"
                print(f"Error al crear usuario: {error_message}") #Depuración
                return render(request, 'usuarios/registro.html', {'error_message': error_message})
        else:
            print("Contraseñas no coinciden") #Depuración
            error_message = "Las contraseñas no coinciden"
            return render(request, 'usuarios/registro.html', {'error_message': error_message})
    else:
        print("Método GET") #Depuración
    return render(request, 'usuarios/registro.html')


def login_usuario(request):
    print("Vista iniciar_sesion llamada")  # Depuración
    if request.method == 'POST':
        print("Método POST recibido")  # Depuración
        username = request.POST.get('username') # Obtener el username del campo 'username'
        password = request.POST.get('password')

        print(f"Username: {username}")  # Depuración

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            print(f"Usuario {username} autenticado y logueado.")  # Depuración
            return redirect('inicio')
        else:
            print("Error de autenticación: Usuario o contraseña incorrectos.")  # Depuración
            messages.error(request, 'Usuario o contraseña incorrectos.')
            return render(request, 'inicio_sesion.html', {'error_message': 'Usuario o contraseña incorrectos.'})
    else:
        print("Método GET")  # Depuración
    return render(request, 'inicio_sesion.html')
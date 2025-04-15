from io import BytesIO

from django.shortcuts import render
from django_otp.plugins.otp_totp.models import TOTPDevice
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
import qrcode
import base64

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
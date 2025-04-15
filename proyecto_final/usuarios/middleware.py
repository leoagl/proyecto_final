from django.shortcuts import redirect
from django.urls import reverse
from django_otp.plugins.otp_totp.models import TOTPDevice


class ForzarMFAAdminMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            is_admin = getattr(request.user, 'rol', '') == 'admin'
            en_admin = request.path.startswith('/admin/')

            if is_admin and en_admin:
                confirmado = TOTPDevice.objects.filter(user=request.user, confirmed=True).exists()

                # Si no tiene MFA confirmado
                if not confirmado:
                    # Ya tiene un dispositivo creado, pero no confirmado
                    pendiente = TOTPDevice.objects.filter(user=request.user, confirmed=False).first()

                    if pendiente:
                        if request.path != reverse('verificar_mfa'):
                            return redirect('verificar_mfa')
                    else:
                        if request.path != reverse('configurar_mfa'):
                            return redirect('configurar_mfa')

        return self.get_response(request)

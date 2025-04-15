from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario
# Register your models here.

class UsuarioAdmin(UserAdmin):
    # Campos a mostrar al editar un usuario
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información personal', {'fields': ('first_name', 'last_name', 'correo_electronico')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login', 'date_joined')}),
        ('Roles', {'fields': ('rol',)}),  # Añade el campo 'rol' aquí
    )

    # Campos a mostrar al CREAR un usuario
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'correo_electronico', 'password1', 'password2', 'rol'),  # ¡Añade 'correo_electronico' aquí!
        }),
    )

    list_display = ('username', 'correo_electronico', 'rol', 'is_staff')  # Campos en la lista de usuarios
    search_fields = ('username', 'correo_electronico')  # Campos buscables
    ordering = ('username',)


admin.site.register(Usuario, UsuarioAdmin)
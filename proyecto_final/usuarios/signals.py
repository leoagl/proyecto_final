from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=User)
def marcar_como_staff(sender, instance, created, **kwargs):
    if created and getattr(instance, 'rol', '') == 'admin':
        instance.is_staff = True
        instance.save()
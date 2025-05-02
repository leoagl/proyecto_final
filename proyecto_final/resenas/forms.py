from django import forms
from .models import Reseña

class ReseñaForm(forms.ModelForm):
    class Meta:
        model = Reseña
        fields = ['comentario', 'calificacion']
        widgets = {
            'comentario': forms.Textarea(attrs={'rows': 3, 'placeholder': 'Escribe tu reseña...'}),
            'calificacion': forms.Select()
        }

from django.shortcuts import render

# Create your views here.
def prestamos(request):
    return render(request, 'prestamos.html')
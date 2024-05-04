from django.shortcuts import render

def index(request):
    context = {
        'title': 'Strona główna',
    }
    return render(request, 'index.html', context)
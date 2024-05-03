from django.shortcuts import render

def index(request):
    context = {
        'title': 'Strona główna',
        'content': 'Hello World',
    }
    return render(request, 'index.html', context)
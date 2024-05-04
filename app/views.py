from django.shortcuts import render

def index(request):
    context = {
        'title': 'Strona główna',
        'content': 'Hello World 2',
    }
    return render(request, 'index.html', context)
from django.shortcuts import render

from api.models import User

def index(request):

    context = {
        'title': 'Strona główna',
    }

    users = User.objects.all().order_by('-click', 'name').values("name", "click")
    x = 0
    for user in users:
        context[f"user{x}"] = user
        x += 1

    return render(request, 'index.html', context)

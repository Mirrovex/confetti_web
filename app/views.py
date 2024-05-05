from django.shortcuts import render

from api.models import User

def index(request):

    if not request.session.exists(request.session.session_key):
        request.session.create()

    context = {
        'title': 'Strona główna',
    }

    users = User.objects.all().order_by('-click', 'name')
    x = 0
    for user in users:
        context[f"user{x}"] = {
            "name": user.name,
            "click": user.click,
            "current": True if user.session == request.session.session_key else False
        }
        x += 1

    return render(request, 'index.html', context)

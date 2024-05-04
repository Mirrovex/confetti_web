from django.urls import path

from .views import *

urlpatterns = [
    path("user/", UserView.as_view()),
    path("click/", ClickView.as_view()),
    path("get_user/", GetUserView.as_view()),
    path("create_user/", CreateUserView.as_view()),
    path("logout/", LogoutView.as_view()),
]
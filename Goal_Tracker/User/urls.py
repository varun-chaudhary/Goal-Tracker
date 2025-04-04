from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.createuser, name='createuser'),
    path('login/', views.login, name='login'),
]
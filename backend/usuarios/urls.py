from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('buscar_candidatos/', views.buscar_candidatos, name='buscar_candidatos'),
]
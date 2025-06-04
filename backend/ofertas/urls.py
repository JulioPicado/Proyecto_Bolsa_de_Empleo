from django.urls import path
from . import views

urlpatterns = [
    path('crear_oferta/', views.crear_oferta, name='crear_oferta'),
    path('obtener_ofertas/', views.obtener_ofertas, name='obtener_ofertas'),
]
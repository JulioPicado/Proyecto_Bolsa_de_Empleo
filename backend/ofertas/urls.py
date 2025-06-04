from django.urls import path
from . import views

urlpatterns = [
    path('crear_oferta/', views.crear_oferta, name='crear_oferta'),
    path('obtener_ofertas/', views.obtener_ofertas, name='obtener_ofertas'),
    path('obtener_ofertas_empresa/<int:empresa_id>/', views.obtener_ofertas_empresa, name='obtener_ofertas_empresa'),
    path('obtener_ofertas_empresa_filtros/', views.obtener_ofertas_empresa_con_filtros, name='obtener_ofertas_empresa_filtros'),
]
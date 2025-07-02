from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from . import views

urlpatterns = [
    path('crear_postulacion/', views.crear_postulacion, name='crear_postulacion'),
    path('obtener_postulaciones_postulante/<int:postulante_id>/', views.obtener_postulaciones_postulante, name='obtener_postulaciones_postulante'),
    path('obtener_postulantes_empresa/<int:empresa_id>/', views.obtener_postulantes_empresa, name='obtener_postulantes_empresa'),
    path('obtener_postulaciones_oferta/<int:oferta_id>/', views.obtener_postulaciones_oferta, name='obtener_postulaciones_oferta'),
    path('actualizar_estado_postulacion/<int:postulacion_id>/', views.actualizar_estado_postulacion, name='actualizar_estado_postulacion'),
]

if settings.DEBUG:
      urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
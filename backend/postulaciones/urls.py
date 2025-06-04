from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from . import views

urlpatterns = [
    path('crear_postulacion/', views.crear_postulacion, name='crear_postulacion'),
    path('obtener_postulaciones_postulante/<int:postulante_id>/', views.obtener_postulaciones_postulante, name='obtener_postulaciones_postulante'),
]

if settings.DEBUG:
      urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
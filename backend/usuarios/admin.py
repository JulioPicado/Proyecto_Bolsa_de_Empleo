from django.contrib import admin
from .models import Rol, Usuario, Postulante, Empresa

admin.site.register(Rol)
admin.site.register(Usuario)
admin.site.register(Postulante)
admin.site.register(Empresa)
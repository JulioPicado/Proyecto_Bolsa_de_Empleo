from django.db import models
from django.utils import timezone

class Rol(models.Model):
    """Define los diferentes roles que pueden tener los usuarios."""
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'roles'

    def __str__(self):
        return self.nombre

class Usuario(models.Model):
    """Información base de todos los usuarios del sistema."""
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    correo = models.EmailField(unique=True)
    clave = models.CharField(max_length=255)  # Considera usar Django's auth system
    roles = models.ManyToManyField(Rol)
    fecha_registro = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'usuarios'
        

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.correo})"

class Postulante(models.Model):
    """Información adicional para los usuarios de tipo postulante."""
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='postulante')
    curriculum = models.FileField(upload_to='curriculums/', blank=True, null=True)
    experiencia_laboral = models.TextField(blank=True, null=True)
    educacion = models.TextField(blank=True, null=True)
    habilidades = models.TextField(blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'postulantes'

    def __str__(self):
        return f"Postulante: {self.usuario.nombre} {self.usuario.apellido}"

class Empresa(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='empresa')
    nombre_empresa = models.CharField(max_length=100)
    sector = models.CharField(max_length=50, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    sitio_web = models.URLField(max_length=100, blank=True, null=True)
    telefono_contacto = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'empresas'

    def __str__(self):
        return f"{self.nombre_empresa} - {self.usuario.nombre}"
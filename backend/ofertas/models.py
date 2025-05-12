from django.db import models
from usuarios.models import Empresa
from django.utils import timezone

class Oferta(models.Model):
    ESTADO_CHOICES = [
        ('activa', 'Activa'),
        ('cerrada', 'Cerrada'),
        ('pausada', 'Pausada'),
        ('eliminada', 'Eliminada'),
    ]
    
    TIPO_CONTRATO_CHOICES = [
        ('tiempo_completo', 'Tiempo Completo'),
        ('medio_tiempo', 'Medio Tiempo'),
        ('temporal', 'Temporal'),
        ('freelance', 'Freelance'),
        ('practicas', 'Prácticas/Pasantía'),
        ('proyecto', 'Por Proyecto'),
    ]
    
    empresa = models.ForeignKey(
        Empresa, 
        on_delete=models.CASCADE,
        related_name='ofertas',
        verbose_name='Empresa'
    )
    titulo = models.CharField(max_length=100, verbose_name='Título')
    descripcion = models.TextField(blank=True, null=True, verbose_name='Descripción')
    requisitos = models.TextField(blank=True, null=True, verbose_name='Requisitos')
    ubicacion = models.CharField(max_length=100, blank=True, null=True, verbose_name='Ubicación')
    tipo_contrato = models.CharField(
        max_length=50, 
        choices=TIPO_CONTRATO_CHOICES,
        blank=True, 
        null=True,
        verbose_name='Tipo de Contrato'
    )
    fecha_publicacion = models.DateTimeField(
        default=timezone.now, 
        verbose_name='Fecha de Publicación'
    )
    estado = models.CharField(
        max_length=20, 
        choices=ESTADO_CHOICES,
        default='activa',
        verbose_name='Estado'
    )
    
    class Meta:
        db_table = 'ofertas'
        verbose_name = 'Oferta de Empleo'
        verbose_name_plural = 'Ofertas de Empleo'
        ordering = ['-fecha_publicacion']  # Ordenar por fecha de publicación (más reciente primero)
    
    def __str__(self):
        return f"{self.titulo} - {self.empresa.nombre_empresa}"

from django.db import models
from ofertas.models import Oferta
from usuarios.models import Postulante
from django.utils import timezone

class Postulacion(models.Model):
    ESTADO_CHOICES = [
        ('enviada', 'Enviada'),
        ('en_revision', 'En revisión'),
        ('entrevista', 'Entrevista programada'),
        ('aceptada', 'Aceptada'),
        ('rechazada', 'Rechazada'),
    ]
    
    oferta = models.ForeignKey(
        Oferta,
        on_delete=models.CASCADE,
        related_name='postulaciones',
        verbose_name='Oferta'
    )
    
    postulante = models.ForeignKey(
        Postulante,
        on_delete=models.CASCADE,
        related_name='postulaciones',
        verbose_name='Postulante'
    )
    
    fecha_postulacion = models.DateTimeField(
        default=timezone.now,
        verbose_name='Fecha de Postulación'
    )
    
    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='enviada',
        verbose_name='Estado'
    )
    
    mensaje = models.TextField(
        blank=True,
        null=True,
        verbose_name='Mensaje de presentación'
    )

    archivo_adjunto = models.FileField(
        upload_to='postulaciones/',
        blank=True,
        null=True,
        verbose_name='Archivo adjunto'
    )
    
    class Meta:
        db_table = 'postulaciones'
        verbose_name = 'Postulación'
        verbose_name_plural = 'Postulaciones'
        ordering = ['-fecha_postulacion']
        # Evitar postulaciones duplicadas
        unique_together = ['oferta', 'postulante']
    
    def __str__(self):
        return f"Postulación de {self.postulante.usuario.nombre} a {self.oferta.titulo} ({self.estado})"

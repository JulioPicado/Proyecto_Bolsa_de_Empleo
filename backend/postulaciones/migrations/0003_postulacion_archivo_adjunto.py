# Generated by Django 4.0.2 on 2025-06-04 04:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('postulaciones', '0002_alter_postulacion_table'),
    ]

    operations = [
        migrations.AddField(
            model_name='postulacion',
            name='archivo_adjunto',
            field=models.FileField(blank=True, null=True, upload_to='postulaciones/', verbose_name='Archivo adjunto'),
        ),
    ]

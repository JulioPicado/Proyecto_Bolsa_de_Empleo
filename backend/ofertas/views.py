from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Oferta
from usuarios.models import Empresa
from postulaciones.models import Postulacion

# Create your views here.
@api_view(['POST'])
def crear_oferta(request):
    data = request.data
    required_fields = ['empresa_id', 'titulo']
    for field in required_fields:
        if field not in data:
            return Response({'error': f'El campo {field} es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        empresa = Empresa.objects.get(id=data['empresa_id'])
    except Empresa.DoesNotExist:
        return Response({'error': 'Empresa no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    oferta = Oferta(
        empresa=empresa,
        titulo=data['titulo'],
        descripcion=data.get('descripcion', ''),
        requisitos=data.get('requisitos', ''),
        ubicacion=data.get('ubicacion', ''),
        tipo_contrato=data.get('tipo_contrato', None),
        estado=data.get('estado', 'activa')
    )
    oferta.save()

    return Response({
        'id': oferta.id,
        'titulo': oferta.titulo,
        'descripcion': oferta.descripcion,
        'requisitos': oferta.requisitos,
        'ubicacion': oferta.ubicacion,
        'tipo_contrato': oferta.tipo_contrato,
        'fecha_publicacion': oferta.fecha_publicacion,
        'estado': oferta.estado,
        'empresa_id': oferta.empresa.id
    }, status=status.HTTP_201_CREATED)

    
@api_view(['GET'])
def obtener_ofertas(request):
    # Obtener el parámetro opcional postulante_id
    postulante_id = request.GET.get('postulante_id', None)
    
    # Comenzar con todas las ofertas activas
    ofertas = Oferta.objects.filter(estado='activa')
    
    # Si se proporciona postulante_id, excluir ofertas donde ya aplicó
    if postulante_id:
        # Obtener IDs de ofertas donde el postulante ya aplicó
        ofertas_aplicadas = Postulacion.objects.filter(
            postulante_id=postulante_id
        ).values_list('oferta_id', flat=True)
        
        # Excluir esas ofertas
        ofertas = ofertas.exclude(id__in=ofertas_aplicadas)
    
    ofertas_data = []
    for oferta in ofertas:
        ofertas_data.append({
            'id': oferta.id,
            'titulo': oferta.titulo,
            'descripcion': oferta.descripcion,
            'requisitos': oferta.requisitos,
            'ubicacion': oferta.ubicacion,
            'tipo_contrato': oferta.tipo_contrato,
            'fecha_publicacion': oferta.fecha_publicacion,
            'estado': oferta.estado,
            'empresa_id': oferta.empresa.id,
            'empresa_nombre': oferta.empresa.nombre_empresa
        })
    return Response(ofertas_data, status=status.HTTP_200_OK)
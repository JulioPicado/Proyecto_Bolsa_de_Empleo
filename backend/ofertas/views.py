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

@api_view(['GET'])
def obtener_ofertas_empresa(request, empresa_id):
    """
    Obtiene todas las ofertas de una empresa específica.
    """
    try:
        empresa = Empresa.objects.get(id=empresa_id)
    except Empresa.DoesNotExist:
        return Response({'error': 'Empresa no encontrada.'}, 
                      status=status.HTTP_404_NOT_FOUND)
    
    # Obtener todas las ofertas de la empresa, ordenadas por fecha de publicación
    ofertas = Oferta.objects.filter(empresa=empresa).order_by('-fecha_publicacion')
    
    ofertas_data = []
    for oferta in ofertas:
        # Contar cuántas postulaciones tiene cada oferta
        num_postulaciones = Postulacion.objects.filter(oferta=oferta).count()
        
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
            'empresa_nombre': oferta.empresa.nombre_empresa,
            'num_postulaciones': num_postulaciones
        })
    
    return Response(ofertas_data, status=status.HTTP_200_OK)


@api_view(['GET'])
def obtener_ofertas_empresa_con_filtros(request):
    """
    Obtiene ofertas de una empresa con filtros opcionales.
    Parámetros de query: empresa_id (obligatorio), estado (opcional)
    """
    empresa_id = request.GET.get('empresa_id', None)
    
    if not empresa_id:
        return Response({'error': 'El parámetro empresa_id es obligatorio.'}, 
                      status=status.HTTP_400_BAD_REQUEST)
    
    try:
        empresa = Empresa.objects.get(id=empresa_id)
    except Empresa.DoesNotExist:
        return Response({'error': 'Empresa no encontrada.'}, 
                      status=status.HTTP_404_NOT_FOUND)
    
    # Comenzar con todas las ofertas de la empresa
    ofertas = Oferta.objects.filter(empresa=empresa)
    
    # Filtro opcional por estado
    estado_filtro = request.GET.get('estado', None)
    if estado_filtro:
        ofertas = ofertas.filter(estado=estado_filtro)
    
    # Ordenar por fecha de publicación (más recientes primero)
    ofertas = ofertas.order_by('-fecha_publicacion')
    
    ofertas_data = []
    for oferta in ofertas:
        # Contar postulaciones por estado
        postulaciones_por_estado = {
            'total': Postulacion.objects.filter(oferta=oferta).count(),
            'enviada': Postulacion.objects.filter(oferta=oferta, estado='enviada').count(),
            'en_revision': Postulacion.objects.filter(oferta=oferta, estado='en_revision').count(),
            'entrevista': Postulacion.objects.filter(oferta=oferta, estado='entrevista').count(),
            'aceptada': Postulacion.objects.filter(oferta=oferta, estado='aceptada').count(),
            'rechazada': Postulacion.objects.filter(oferta=oferta, estado='rechazada').count(),
        }
        
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
            'empresa_nombre': oferta.empresa.nombre_empresa,
            'postulaciones': postulaciones_por_estado
        })
    
    return Response(ofertas_data, status=status.HTTP_200_OK)
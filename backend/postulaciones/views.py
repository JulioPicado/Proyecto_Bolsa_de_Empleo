from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Postulacion
from ofertas.models import Oferta
from usuarios.models import Postulante

# Create your views here.

@api_view(['POST'])
def crear_postulacion(request):
    """
    Crea una nueva postulación a una oferta de empleo.
    Requiere oferta_id, postulante_id y opcionalmente mensaje y archivo_adjunto.
    """
    data = request.data
    required_fields = ['oferta_id', 'postulante_id']
    
    # Validar campos obligatorios
    for field in required_fields:
        if field not in data:
            return Response({'error': f'El campo {field} es obligatorio.'}, 
                          status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Verificar que la oferta exista
        oferta = Oferta.objects.get(id=data['oferta_id'])
        if oferta.estado != 'activa':
            return Response({'error': 'Esta oferta no está activa.'}, 
                          status=status.HTTP_400_BAD_REQUEST)
    except Oferta.DoesNotExist:
        return Response({'error': 'Oferta no encontrada.'}, 
                      status=status.HTTP_404_NOT_FOUND)
    
    try:
        # Verificar que el postulante exista
        postulante = Postulante.objects.get(id=data['postulante_id'])
    except Postulante.DoesNotExist:
        return Response({'error': 'Postulante no encontrado.'}, 
                      status=status.HTTP_404_NOT_FOUND)
    
    # Verificar si ya existe una postulación para esta combinación
    if Postulacion.objects.filter(oferta=oferta, postulante=postulante).exists():
        return Response({'error': 'Ya has aplicado a esta oferta.'}, 
                      status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Crear la postulación
        postulacion = Postulacion.objects.create(
            oferta=oferta,
            postulante=postulante,
            mensaje=data.get('mensaje', ''),
            archivo_adjunto=request.FILES.get('archivo_adjunto', None),
            estado=data.get('estado', 'enviada')
        )
        
        return Response({
            'id': postulacion.id,
            'oferta_id': postulacion.oferta.id,
            'oferta_titulo': postulacion.oferta.titulo,
            'postulante_id': postulacion.postulante.id,
            'postulante_nombre': f"{postulacion.postulante.usuario.nombre} {postulacion.postulante.usuario.apellido}",
            'fecha_postulacion': postulacion.fecha_postulacion,
            'estado': postulacion.estado,
            'mensaje': postulacion.mensaje,
            'archivo_adjunto': postulacion.archivo_adjunto.url if postulacion.archivo_adjunto else None
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, 
                      status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def obtener_postulaciones_postulante(request, postulante_id):
    """
    Obtiene todas las postulaciones de un postulante específico.
    """
    try:
        postulante = Postulante.objects.get(id=postulante_id)
    except Postulante.DoesNotExist:
        return Response({'error': 'Postulante no encontrado.'}, 
                      status=status.HTTP_404_NOT_FOUND)
    
    postulaciones = Postulacion.objects.filter(postulante=postulante).order_by('-fecha_postulacion')
    
    postulaciones_data = []
    for postulacion in postulaciones:
        postulaciones_data.append({
            'id': postulacion.id,
            'oferta_id': postulacion.oferta.id,
            'oferta_titulo': postulacion.oferta.titulo,
            'empresa_nombre': postulacion.oferta.empresa.nombre_empresa,
            'fecha_postulacion': postulacion.fecha_postulacion,
            'estado': postulacion.estado,
            'mensaje': postulacion.mensaje,
            'archivo_adjunto': postulacion.archivo_adjunto.url if postulacion.archivo_adjunto else None
        })
    
    return Response(postulaciones_data, status=status.HTTP_200_OK)


@api_view(['GET'])
def obtener_postulaciones_oferta(request, oferta_id):
    """
    Obtiene todas las postulaciones para una oferta específica.
    """
    try:
        oferta = Oferta.objects.get(id=oferta_id)
    except Oferta.DoesNotExist:
        return Response({'error': 'Oferta no encontrada.'}, 
                      status=status.HTTP_404_NOT_FOUND)
    
    postulaciones = Postulacion.objects.filter(oferta=oferta).order_by('-fecha_postulacion')
    
    postulaciones_data = []
    for postulacion in postulaciones:
        postulaciones_data.append({
            'id': postulacion.id,
            'postulante_id': postulacion.postulante.id,
            'postulante_nombre': f"{postulacion.postulante.usuario.nombre} {postulacion.postulante.usuario.apellido}",
            'postulante_correo': postulacion.postulante.usuario.correo,
            'fecha_postulacion': postulacion.fecha_postulacion,
            'estado': postulacion.estado,
            'mensaje': postulacion.mensaje,
            'archivo_adjunto': postulacion.archivo_adjunto.url if postulacion.archivo_adjunto else None
        })
    
    return Response(postulaciones_data, status=status.HTTP_200_OK)


@api_view(['GET'])
def obtener_postulantes_empresa(request, empresa_id):
    """
    Devuelve todas las postulaciones a las ofertas de una empresa específica.
    """
    # Obtener todas las ofertas de la empresa usando usuario_id
    ofertas = Oferta.objects.filter(empresa__usuario_id=empresa_id)
    # Obtener todas las postulaciones a esas ofertas
    postulaciones = Postulacion.objects.filter(oferta__in=ofertas).select_related('postulante__usuario', 'oferta')
    # Serializar los datos
    postulaciones_data = []
    for postulacion in postulaciones:
        # Construir URL completa para archivo adjunto
        archivo_adjunto_url = None
        if postulacion.archivo_adjunto:
            archivo_adjunto_url = request.build_absolute_uri(postulacion.archivo_adjunto.url)
        
        postulaciones_data.append({
            'id': postulacion.id,
            'oferta_id': postulacion.oferta.id,
            'oferta_titulo': postulacion.oferta.titulo,
            'postulante_id': postulacion.postulante.id,
            'postulante_nombre': f"{postulacion.postulante.usuario.nombre} {postulacion.postulante.usuario.apellido}",
            'postulante_correo': postulacion.postulante.usuario.correo,
            'telefono': postulacion.postulante.telefono,
            'direccion': postulacion.postulante.direccion,
            'experiencia_laboral': postulacion.postulante.experiencia_laboral,
            'educacion': postulacion.postulante.educacion,
            'habilidades': postulacion.postulante.habilidades,
            'curriculum': request.build_absolute_uri(postulacion.postulante.curriculum.url) if postulacion.postulante.curriculum else None,
            'fecha_postulacion': postulacion.fecha_postulacion,
            'estado': postulacion.estado,
            'mensaje': postulacion.mensaje,
            'archivo_adjunto': archivo_adjunto_url
        })
    return Response({'postulaciones': postulaciones_data, 'total': len(postulaciones_data)}, status=status.HTTP_200_OK)


@api_view(['PUT'])
def actualizar_estado_postulacion(request, postulacion_id):
    """
    Actualiza el estado de una postulación específica.
    Requiere: estado (aceptada, rechazada, en_revision, entrevista)
    """
    try:
        postulacion = Postulacion.objects.get(id=postulacion_id)
    except Postulacion.DoesNotExist:
        return Response({'error': 'Postulación no encontrada.'}, 
                      status=status.HTTP_404_NOT_FOUND)
    
    # Validar que se envíe el estado
    nuevo_estado = request.data.get('estado')
    if not nuevo_estado:
        return Response({'error': 'El campo estado es obligatorio.'}, 
                      status=status.HTTP_400_BAD_REQUEST)
    
    # Validar que el estado sea válido
    estados_validos = ['enviada', 'en_revision', 'entrevista', 'aceptada', 'rechazada']
    if nuevo_estado not in estados_validos:
        return Response({'error': f'Estado inválido. Estados válidos: {", ".join(estados_validos)}'}, 
                      status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Actualizar el estado
        postulacion.estado = nuevo_estado
        postulacion.save()
        
        return Response({
            'id': postulacion.id,
            'estado': postulacion.estado,
            'mensaje': f'Estado actualizado a {nuevo_estado} correctamente.',
            'postulante_nombre': f"{postulacion.postulante.usuario.nombre} {postulacion.postulante.usuario.apellido}",
            'oferta_titulo': postulacion.oferta.titulo
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, 
                      status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

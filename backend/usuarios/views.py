from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Usuario, Rol, Postulante, Empresa
from django.contrib.auth.hashers import check_password, make_password
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Registra un nuevo usuario en el sistema.
    Requiere información personal y el tipo de usuario (postulante o empresa).
    """
    if request.method == 'POST':
        # Verifica que todos los campos necesarios estén presentes
        required_fields = ['nombre', 'apellido', 'correo', 'clave', 'confirmar_clave', 'tipo_usuario']
        for field in required_fields:
            if field not in request.data:
                return Response({'error': f'El campo {field} es obligatorio'}, 
                                status=status.HTTP_400_BAD_REQUEST)
        
        # Verifica que las contraseñas coincidan
        if request.data['clave'] != request.data['confirmar_clave']:
            return Response({'error': 'Las contraseñas no coinciden'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Verifica si el correo ya existe
        if Usuario.objects.filter(correo=request.data['correo']).exists():
            return Response({'error': 'Este correo ya está registrado'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        tipo_usuario = request.data['tipo_usuario']
        if tipo_usuario not in ['postulante', 'empresa']:
            return Response({'error': 'Tipo de usuario inválido. Debe ser "postulante" o "empresa"'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Crear el usuario con la contraseña hasheada
            usuario = Usuario.objects.create(
                nombre=request.data['nombre'],
                apellido=request.data['apellido'],
                correo=request.data['correo'],
                clave=make_password(request.data['clave'])  # Encriptar la contraseña
            )
            
            # Asignar el rol correspondiente
            rol = Rol.objects.get(nombre=tipo_usuario)
            usuario.roles.add(rol)
            
            # Crear perfil específico según el tipo de usuario
            if tipo_usuario == 'postulante':
                postulante = Postulante.objects.create(
                    usuario=usuario,
                    telefono=request.data.get('telefono', ''),
                    direccion=request.data.get('direccion', ''),
                    curriculum=request.FILES.get('curriculum', None),
                    experiencia_laboral=request.data.get('experiencia_laboral', ''),
                    educacion=request.data.get('educacion', ''),
                    habilidades=request.data.get('habilidades', '')
                )
                perfil_info = {
                    'id_postulante': postulante.id,
                    'curriculum': postulante.curriculum.url if postulante.curriculum else None,
                    'experiencia_laboral': postulante.experiencia_laboral,
                    'educacion': postulante.educacion,
                    'habilidades': postulante.habilidades
                }
                
            elif tipo_usuario == 'empresa':
                if 'nombre_empresa' not in request.data:
                    return Response({'error': 'El nombre de la empresa es obligatorio'}, 
                                   status=status.HTTP_400_BAD_REQUEST)
                    
                empresa = Empresa.objects.create(
                    usuario=usuario,
                    nombre_empresa=request.data['nombre_empresa'],
                    sector=request.data.get('sector', ''),
                    descripcion=request.data.get('descripcion', ''),
                    sitio_web=request.data.get('sitio_web', ''),
                    telefono_contacto=request.data.get('telefono_contacto', ''),
                    direccion=request.data.get('direccion', '')
                )
                perfil_info = {
                    'id_empresa': empresa.id,
                    'nombre_empresa': empresa.nombre_empresa,
                    'sector': empresa.sector,
                    'sitio_web': empresa.sitio_web
                }
            
            # También podríamos crear un token personalizado para autenticación
            # Pero necesitaríamos adaptar la autenticación para nuestro modelo personalizado
            
            return Response({
                'id': usuario.id,
                'nombre': usuario.nombre,
                'apellido': usuario.apellido,
                'correo': usuario.correo,
                'tipo_usuario': tipo_usuario,
                'perfil': perfil_info,
                'fecha_registro': usuario.fecha_registro
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Autentica a un usuario y devuelve la información del usuario si las credenciales son válidas.
    Requiere correo y clave.
    """
    if request.method == 'POST':
        correo = request.data.get('correo', '')
        clave = request.data.get('clave', '')
        
        # Validar campos
        if not correo or not clave:
            return Response({'error': 'El correo y la clave son obligatorios'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Buscar usuario
            usuario = Usuario.objects.get(correo=correo)
            
            # Verificar clave
            if not check_password(clave, usuario.clave):
                return Response({'error': 'Credenciales inválidas'}, 
                                status=status.HTTP_401_UNAUTHORIZED)
            
            # Generar token JWT
            refresh = RefreshToken.for_user(usuario)
            
            # Obtener roles y perfiles
            roles = [rol.nombre for rol in usuario.roles.all()]
            perfiles = {}
            
            # Verificar si el usuario tiene rol de postulante
            if 'postulante' in roles:
                try:
                    postulante = Postulante.objects.get(usuario=usuario)
                    perfiles['postulante'] = {
                        'id': postulante.id,
                        'curriculum': postulante.curriculum.url if postulante.curriculum else None,
                        'experiencia_laboral': postulante.experiencia_laboral,
                        'educacion': postulante.educacion,
                        'habilidades': postulante.habilidades
                    }
                except Postulante.DoesNotExist:
                    pass
            
            # Verificar si el usuario tiene rol de empresa
            if 'empresa' in roles:
                try:
                    empresa = Empresa.objects.get(usuario=usuario)
                    perfiles['empresa'] = {
                        'id': empresa.id,
                        'nombre_empresa': empresa.nombre_empresa,
                        'sector': empresa.sector,
                        'sitio_web': empresa.sitio_web
                    }
                except Empresa.DoesNotExist:
                    pass
            
            # Devolver token y datos de usuario
            return Response({
                'id': usuario.id,
                'nombre': usuario.nombre,
                'apellido': usuario.apellido,
                'correo': usuario.correo,
                'roles': roles,
                'perfiles': perfiles,
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_200_OK)
            
        except Usuario.DoesNotExist:
            return Response({'error': 'Credenciales inválidas'}, 
                            status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



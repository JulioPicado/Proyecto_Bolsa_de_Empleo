from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
import json
from .models import Usuario, Empresa, Postulante


class UsuariosTestCase(TestCase):
    def setUp(self):
        """Configuración inicial para tests de usuarios"""
        self.client = Client()

    def test_crear_usuario_basico(self):
        """Test crear usuario básico"""
        usuario = Usuario.objects.create(
            nombre='Juan',
            apellido='Pérez',
            correo='test@test.com',
            clave='testpass123'
        )
        
        self.assertEqual(usuario.nombre, 'Juan')
        self.assertEqual(usuario.apellido, 'Pérez')
        self.assertEqual(usuario.correo, 'test@test.com')

    def test_crear_empresa(self):
        """Test crear empresa"""
        usuario = Usuario.objects.create(
            nombre='Empresa',
            apellido='Test',
            correo='empresa@test.com',
            clave='testpass123'
        )
        
        empresa = Empresa.objects.create(
            usuario=usuario,
            nombre_empresa='Test Company',
            descripcion='Una empresa de prueba',
            direccion='Calle Test 123',
            telefono_contacto='123456789'
        )
        
        self.assertEqual(empresa.nombre_empresa, 'Test Company')
        self.assertEqual(empresa.usuario, usuario)
        self.assertEqual(empresa.telefono_contacto, '123456789')

    def test_crear_postulante(self):
        """Test crear postulante"""
        usuario = Usuario.objects.create(
            nombre='Juan',
            apellido='Pérez',
            correo='postulante@test.com',
            clave='testpass123'
        )
        
        postulante = Postulante.objects.create(
            usuario=usuario,
            telefono='987654321',
            direccion='Calle Postulante 456',
            habilidades='Python, Django'
        )
        
        self.assertEqual(postulante.usuario.nombre, 'Juan')
        self.assertEqual(postulante.usuario.apellido, 'Pérez')
        self.assertEqual(postulante.usuario, usuario)
        self.assertEqual(postulante.telefono, '987654321')

    def test_str_methods(self):
        """Test métodos __str__ de los modelos"""
        usuario = Usuario.objects.create(
            nombre='Test',
            apellido='User',
            correo='test@test.com',
            clave='testpass123'
        )
        
        empresa = Empresa.objects.create(
            usuario=usuario,
            nombre_empresa='Test Company'
        )
        
        postulante = Postulante.objects.create(
            usuario=usuario
        )
        
        self.assertEqual(str(empresa), 'Test Company - Test')
        self.assertEqual(str(postulante), 'Postulante: Test User')

    def test_relaciones_models(self):
        """Test relaciones entre modelos"""
        usuario = Usuario.objects.create(
            nombre='Test',
            apellido='User',
            correo='test@test.com',
            clave='testpass123'
        )
        
        # Verificar que un usuario puede tener empresa
        empresa = Empresa.objects.create(
            usuario=usuario,
            nombre_empresa='Test Company'
        )
        
        self.assertEqual(empresa.usuario, usuario)
        # Verificar relación inversa
        self.assertEqual(usuario.empresa.get(), empresa)


class EmpresaModelTestCase(TestCase):
    def setUp(self):
        """Setup para tests de empresa"""
        self.usuario = Usuario.objects.create(
            nombre='Empresa',
            apellido='Test',
            correo='empresa@test.com',
            clave='testpass123'
        )

    def test_campos_obligatorios_empresa(self):
        """Test campos obligatorios de empresa"""
        empresa = Empresa.objects.create(
            usuario=self.usuario,
            nombre_empresa='Empresa Mínima'
        )
        
        self.assertEqual(empresa.nombre_empresa, 'Empresa Mínima')
        self.assertEqual(empresa.usuario, self.usuario)

    def test_campos_opcionales_empresa(self):
        """Test campos opcionales de empresa"""
        empresa = Empresa.objects.create(
            usuario=self.usuario,
            nombre_empresa='Empresa Completa',
            descripcion='Descripción completa',
            direccion='Calle 123',
            telefono_contacto='123456789',
            sitio_web='https://empresa.com'
        )
        
        self.assertEqual(empresa.descripcion, 'Descripción completa')
        self.assertEqual(empresa.direccion, 'Calle 123')
        self.assertEqual(empresa.telefono_contacto, '123456789')
        self.assertEqual(empresa.sitio_web, 'https://empresa.com')


class PostulanteModelTestCase(TestCase):
    def setUp(self):
        """Setup para tests de postulante"""
        self.usuario = Usuario.objects.create(
            nombre='Postulante',
            apellido='Test',
            correo='postulante@test.com',
            clave='testpass123'
        )

    def test_campos_obligatorios_postulante(self):
        """Test campos obligatorios de postulante"""
        postulante = Postulante.objects.create(
            usuario=self.usuario
        )
        
        self.assertEqual(postulante.usuario.nombre, 'Postulante')
        self.assertEqual(postulante.usuario.apellido, 'Test')
        self.assertEqual(postulante.usuario, self.usuario)

    def test_campos_opcionales_postulante(self):
        """Test campos opcionales de postulante"""
        postulante = Postulante.objects.create(
            usuario=self.usuario,
            telefono='987654321',
            direccion='Avenida 456',
            experiencia_laboral='5 años en desarrollo',
            habilidades='Python, Django, React',
            educacion='Ingeniería en Sistemas'
        )
        
        self.assertEqual(postulante.telefono, '987654321')
        self.assertEqual(postulante.direccion, 'Avenida 456')
        self.assertEqual(postulante.experiencia_laboral, '5 años en desarrollo')
        self.assertEqual(postulante.habilidades, 'Python, Django, React')
        self.assertEqual(postulante.educacion, 'Ingeniería en Sistemas')



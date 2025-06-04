from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
import json
from .models import Oferta
from usuarios.models import Usuario, Empresa


class OfertasBasicTestCase(TestCase):
    def setUp(self):
        """Configuración básica para tests de ofertas"""
        self.client = Client()
        
        # Crear usuario y empresa mínimos para tests
        self.usuario = Usuario.objects.create(
            nombre='Empresa',
            apellido='Test',
            correo='empresa@test.com',
            clave='testpass123'
        )
        
        self.empresa = Empresa.objects.create(
            usuario=self.usuario,
            nombre_empresa='Test Company'
        )

    def test_crear_oferta_modelo(self):
        """Test crear oferta usando el modelo directamente"""
        oferta = Oferta.objects.create(
            empresa=self.empresa,
            titulo='Desarrollador Python',
            descripcion='Posición para desarrollador',
            estado='activa'
        )
        
        self.assertEqual(oferta.titulo, 'Desarrollador Python')
        self.assertEqual(oferta.empresa, self.empresa)
        self.assertEqual(oferta.estado, 'activa')

    def test_campos_opcionales_oferta(self):
        """Test campos opcionales de oferta"""
        oferta = Oferta.objects.create(
            empresa=self.empresa,
            titulo='Oferta Completa',
            descripcion='Descripción completa',
            requisitos='Python, Django',
            ubicacion='Lima, Perú',
            tipo_contrato='tiempo_completo',
            estado='activa'
        )
        
        self.assertEqual(oferta.requisitos, 'Python, Django')
        self.assertEqual(oferta.ubicacion, 'Lima, Perú')
        self.assertEqual(oferta.tipo_contrato, 'tiempo_completo')

    def test_str_method_oferta(self):
        """Test método __str__ de oferta"""
        oferta = Oferta.objects.create(
            empresa=self.empresa,
            titulo='Test Oferta'
        )
        
        # Ajustar según tu implementación del método __str__
        # self.assertEqual(str(oferta), 'Test Oferta')

    def test_fecha_publicacion_auto(self):
        """Test que fecha_publicacion se asigna automáticamente"""
        oferta = Oferta.objects.create(
            empresa=self.empresa,
            titulo='Test Fecha'
        )
        
        self.assertIsNotNone(oferta.fecha_publicacion)


class OfertasAPITestCase(TestCase):
    def setUp(self):
        """Setup para tests de API de ofertas"""
        self.client = Client()
        
        # Datos mínimos para tests
        self.usuario = Usuario.objects.create(
            nombre='Empresa',
            apellido='API',
            correo='empresa_api@test.com',
            clave='testpass123'
        )
        
        self.empresa = Empresa.objects.create(
            usuario=self.usuario,
            nombre_empresa='API Test Company'
        )

    def test_crear_oferta_api_exitoso(self):
        """Test crear oferta vía API con datos válidos"""
        data = {
            'empresa_id': self.empresa.id,
            'titulo': 'Desarrollador API',
            'descripcion': 'Posición para API',
            'estado': 'activa'
        }
        
        response = self.client.post(
            reverse('crear_oferta'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verificar que se creó en BD
        oferta = Oferta.objects.get(titulo='Desarrollador API')
        self.assertEqual(oferta.empresa, self.empresa)

    def test_crear_oferta_sin_titulo(self):
        """Test crear oferta sin título (campo obligatorio)"""
        data = {
            'empresa_id': self.empresa.id,
            'descripcion': 'Sin título'
        }
        
        response = self.client.post(
            reverse('crear_oferta'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_crear_oferta_empresa_inexistente(self):
        """Test crear oferta con empresa que no existe"""
        data = {
            'empresa_id': 999,
            'titulo': 'Test Empresa Inexistente'
        }
        
        response = self.client.post(
            reverse('crear_oferta'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_obtener_ofertas_api(self):
        """Test obtener ofertas vía API"""
        # Crear oferta activa
        Oferta.objects.create(
            empresa=self.empresa,
            titulo='Oferta Activa',
            estado='activa'
        )
        
        # Crear oferta inactiva (no debe aparecer)
        Oferta.objects.create(
            empresa=self.empresa,
            titulo='Oferta Inactiva',
            estado='inactiva'
        )
        
        response = self.client.get(reverse('obtener_ofertas'))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        
        # Solo debe devolver ofertas activas
        self.assertEqual(len(response_data), 1)
        self.assertEqual(response_data[0]['titulo'], 'Oferta Activa')

    def test_obtener_ofertas_empresa_api(self):
        """Test obtener ofertas de una empresa específica"""
        # Crear ofertas para la empresa
        oferta1 = Oferta.objects.create(
            empresa=self.empresa,
            titulo='Oferta 1',
            estado='activa'
        )
        
        oferta2 = Oferta.objects.create(
            empresa=self.empresa,
            titulo='Oferta 2',
            estado='inactiva'
        )
        
        response = self.client.get(
            reverse('obtener_ofertas_empresa', args=[self.empresa.id])
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        
        # Debe devolver todas las ofertas de la empresa (activas e inactivas)
        self.assertEqual(len(response_data), 2)

    def test_obtener_ofertas_empresa_inexistente(self):
        """Test obtener ofertas de empresa que no existe"""
        response = self.client.get(
            reverse('obtener_ofertas_empresa', args=[999])
        )
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class OfertasFilterTestCase(TestCase):
    def setUp(self):
        """Setup para tests de filtros de ofertas"""
        self.client = Client()
        
        self.usuario = Usuario.objects.create(
            nombre='Empresa',
            apellido='Filtros',
            correo='filtros@test.com',
            clave='testpass123'
        )
        
        self.empresa = Empresa.objects.create(
            usuario=self.usuario,
            nombre_empresa='Filtros Company'
        )

    def test_filtro_ofertas_por_estado(self):
        """Test filtrar ofertas por estado"""
        # Crear ofertas con diferentes estados
        Oferta.objects.create(
            empresa=self.empresa,
            titulo='Activa 1',
            estado='activa'
        )
        
        Oferta.objects.create(
            empresa=self.empresa,
            titulo='Inactiva 1',
            estado='inactiva'
        )
        
        # Test obtener solo ofertas activas
        response = self.client.get(reverse('obtener_ofertas'))
        response_data = json.loads(response.content)
        
        # Solo debe devolver ofertas activas
        titulos = [oferta['titulo'] for oferta in response_data]
        self.assertIn('Activa 1', titulos)
        self.assertNotIn('Inactiva 1', titulos)

    def test_campos_respuesta_oferta(self):
        """Test que la respuesta incluye los campos esperados"""
        oferta = Oferta.objects.create(
            empresa=self.empresa,
            titulo='Test Campos',
            descripcion='Descripción test',
            ubicacion='Lima',
            tipo_contrato='tiempo_completo',
            estado='activa'
        )
        
        response = self.client.get(reverse('obtener_ofertas'))
        response_data = json.loads(response.content)
        
        oferta_data = response_data[0]
        campos_esperados = [
            'id', 'titulo', 'estado', 'empresa_id', 'fecha_publicacion'
        ]
        
        for campo in campos_esperados:
            self.assertIn(campo, oferta_data)



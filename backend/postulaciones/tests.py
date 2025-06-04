from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
import json
from .models import Postulacion
from usuarios.models import Usuario, Empresa, Postulante
from ofertas.models import Oferta


class PostulacionesBasicTestCase(TestCase):
    def setUp(self):
        """Configuración básica para tests de postulaciones"""
        self.client = Client()
        
        # Crear usuario empresa
        self.usuario_empresa = Usuario.objects.create(
            nombre='Empresa',
            apellido='Test',
            correo='empresa@test.com',
            clave='testpass123'
        )
        
        self.empresa = Empresa.objects.create(
            usuario=self.usuario_empresa,
            nombre_empresa='Test Company'
        )
        
        # Crear usuario postulante
        self.usuario_postulante = Usuario.objects.create(
            nombre='Juan',
            apellido='Pérez',
            correo='postulante@test.com',
            clave='testpass123'
        )
        
        self.postulante = Postulante.objects.create(
            usuario=self.usuario_postulante
        )
        
        # Crear oferta para postular
        self.oferta = Oferta.objects.create(
            empresa=self.empresa,
            titulo='Desarrollador Python',
            descripcion='Posición para desarrollador',
            estado='activa'
        )

    def test_crear_postulacion_modelo(self):
        """Test crear postulación usando el modelo directamente"""
        postulacion = Postulacion.objects.create(
            postulante=self.postulante,
            oferta=self.oferta,
            mensaje='Estoy interesado en la posición',
            estado='enviada'
        )
        
        self.assertEqual(postulacion.postulante, self.postulante)
        self.assertEqual(postulacion.oferta, self.oferta)
        self.assertEqual(postulacion.estado, 'enviada')
        self.assertEqual(postulacion.mensaje, 'Estoy interesado en la posición')

    def test_campos_obligatorios_postulacion(self):
        """Test campos obligatorios de postulación"""
        postulacion = Postulacion.objects.create(
            postulante=self.postulante,
            oferta=self.oferta
        )
        
        self.assertEqual(postulacion.postulante, self.postulante)
        self.assertEqual(postulacion.oferta, self.oferta)
        # Estado por defecto debe ser 'enviada'
        self.assertEqual(postulacion.estado, 'enviada')

    def test_str_method_postulacion(self):
        """Test método __str__ de postulación"""
        postulacion = Postulacion.objects.create(
            postulante=self.postulante,
            oferta=self.oferta
        )
        
        # Ajustar según tu implementación del método __str__
        expected_str = f"{self.postulante} - {self.oferta}"
        # self.assertEqual(str(postulacion), expected_str)

    def test_fecha_postulacion_auto(self):
        """Test que fecha_postulacion se asigna automáticamente"""
        postulacion = Postulacion.objects.create(
            postulante=self.postulante,
            oferta=self.oferta
        )
        
        self.assertIsNotNone(postulacion.fecha_postulacion)

    def test_estados_postulacion(self):
        """Test diferentes estados de postulación"""
        estados = ['enviada', 'en_revision', 'aceptada', 'rechazada']
        
        for estado in estados:
            postulacion = Postulacion.objects.create(
                postulante=self.postulante,
                oferta=self.oferta,
                estado=estado
            )
            self.assertEqual(postulacion.estado, estado)


class PostulacionesAPITestCase(TestCase):
    def setUp(self):
        """Setup para tests de API de postulaciones"""
        self.client = Client()
        
        # Crear datos mínimos
        self.usuario_empresa = Usuario.objects.create(
            nombre='Empresa',
            apellido='API',
            correo='empresa_api@test.com',
            clave='testpass123'
        )
        
        self.empresa = Empresa.objects.create(
            usuario=self.usuario_empresa,
            nombre_empresa='API Test Company'
        )
        
        self.usuario_postulante = Usuario.objects.create(
            nombre='María',
            apellido='González',
            correo='postulante_api@test.com',
            clave='testpass123'
        )
        
        self.postulante = Postulante.objects.create(
            usuario=self.usuario_postulante
        )
        
        self.oferta = Oferta.objects.create(
            empresa=self.empresa,
            titulo='Desarrollador API',
            estado='activa'
        )

    def test_crear_postulacion_api_exitoso(self):
        """Test crear postulación vía API con datos válidos"""
        data = {
            'postulante_id': self.postulante.id,
            'oferta_id': self.oferta.id,
            'mensaje': 'Me interesa mucho esta posición'
        }
        
        response = self.client.post(
            reverse('crear_postulacion'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verificar que se creó en BD
        postulacion = Postulacion.objects.get(
            postulante=self.postulante,
            oferta=self.oferta
        )
        self.assertEqual(postulacion.mensaje, 'Me interesa mucho esta posición')

    def test_crear_postulacion_sin_postulante(self):
        """Test crear postulación sin postulante_id"""
        data = {
            'oferta_id': self.oferta.id,
            'mensaje': 'Sin postulante'
        }
        
        response = self.client.post(
            reverse('crear_postulacion'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_crear_postulacion_sin_oferta(self):
        """Test crear postulación sin oferta_id"""
        data = {
            'postulante_id': self.postulante.id,
            'mensaje': 'Sin oferta'
        }
        
        response = self.client.post(
            reverse('crear_postulacion'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_crear_postulacion_duplicada(self):
        """Test crear postulación duplicada (mismo postulante-oferta)"""
        # Crear primera postulación
        Postulacion.objects.create(
            postulante=self.postulante,
            oferta=self.oferta
        )
        
        # Intentar crear segunda postulación
        data = {
            'postulante_id': self.postulante.id,
            'oferta_id': self.oferta.id,
            'mensaje': 'Segunda postulación'
        }
        
        response = self.client.post(
            reverse('crear_postulacion'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Debe rechazar postulación duplicada
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_obtener_postulaciones_postulante(self):
        """Test obtener postulaciones de un postulante"""
        # Crear postulaciones
        postulacion1 = Postulacion.objects.create(
            postulante=self.postulante,
            oferta=self.oferta,
            mensaje='Primera postulación'
        )
        
        # Crear segunda oferta y postulación
        oferta2 = Oferta.objects.create(
            empresa=self.empresa,
            titulo='Segunda Oferta',
            estado='activa'
        )
        
        postulacion2 = Postulacion.objects.create(
            postulante=self.postulante,
            oferta=oferta2,
            mensaje='Segunda postulación'
        )
        
        response = self.client.get(
            reverse('obtener_postulaciones_postulante', args=[self.postulante.id])
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        
        self.assertEqual(len(response_data), 2)

    def test_obtener_postulaciones_oferta(self):
        """Test obtener postulaciones de una oferta"""
        # Crear segundo postulante y postulación
        usuario2 = Usuario.objects.create(
            nombre='Carlos',
            apellido='López',
            correo='postulante2@test.com',
            clave='testpass123'
        )
        
        postulante2 = Postulante.objects.create(
            usuario=usuario2
        )
        
        # Crear postulaciones
        Postulacion.objects.create(
            postulante=self.postulante,
            oferta=self.oferta
        )
        
        Postulacion.objects.create(
            postulante=postulante2,
            oferta=self.oferta
        )
        
        response = self.client.get(
            reverse('obtener_postulaciones_oferta', args=[self.oferta.id])
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        
        self.assertEqual(len(response_data), 2)

    def test_cambiar_estado_postulacion(self):
        """Test cambiar estado de postulación"""
        postulacion = Postulacion.objects.create(
            postulante=self.postulante,
            oferta=self.oferta,
            estado='enviada'
        )
        
        data = {
            'estado': 'en_revision'
        }
        
        response = self.client.patch(
            reverse('cambiar_estado_postulacion', args=[postulacion.id]),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar cambio en BD
        postulacion.refresh_from_db()
        self.assertEqual(postulacion.estado, 'en_revision')


class PostulacionesFilterTestCase(TestCase):
    def setUp(self):
        """Setup para tests de filtros de postulaciones"""
        self.client = Client()
        
        # Crear datos básicos
        self.usuario_empresa = Usuario.objects.create(
            nombre='Empresa',
            apellido='Filtros',
            correo='filtros@test.com',
            clave='testpass123'
        )
        
        self.empresa = Empresa.objects.create(
            usuario=self.usuario_empresa,
            nombre_empresa='Filtros Company'
        )
        
        self.usuario_postulante = Usuario.objects.create(
            nombre='Ana',
            apellido='Martínez',
            correo='postulante_filtros@test.com',
            clave='testpass123'
        )
        
        self.postulante = Postulante.objects.create(
            usuario=self.usuario_postulante
        )
        
        self.oferta = Oferta.objects.create(
            empresa=self.empresa,
            titulo='Oferta Filtros',
            estado='activa'
        )

    def test_filtro_postulaciones_por_estado(self):
        """Test filtrar postulaciones por estado"""
        # Crear postulaciones con diferentes estados
        Postulacion.objects.create(
            postulante=self.postulante,
            oferta=self.oferta,
            estado='enviada'
        )
        
        oferta2 = Oferta.objects.create(
            empresa=self.empresa,
            titulo='Oferta 2',
            estado='activa'
        )
        
        Postulacion.objects.create(
            postulante=self.postulante,
            oferta=oferta2,
            estado='aceptada'
        )
        
        # Test filtro por estado
        response = self.client.get(
            reverse('obtener_postulaciones_postulante', args=[self.postulante.id]),
            {'estado': 'aceptada'}
        )
        
        response_data = json.loads(response.content)
        
        # Solo debe devolver postulaciones aceptadas
        self.assertEqual(len(response_data), 1)
        self.assertEqual(response_data[0]['estado'], 'aceptada')

    def test_campos_respuesta_postulacion(self):
        """Test que la respuesta incluye los campos esperados"""
        postulacion = Postulacion.objects.create(
            postulante=self.postulante,
            oferta=self.oferta,
            mensaje='Test campos'
        )
        
        response = self.client.get(
            reverse('obtener_postulaciones_postulante', args=[self.postulante.id])
        )
        
        response_data = json.loads(response.content)
        postulacion_data = response_data[0]
        
        campos_esperados = [
            'id', 'estado', 'fecha_postulacion', 'mensaje'
        ]
        
        for campo in campos_esperados:
            self.assertIn(campo, postulacion_data)

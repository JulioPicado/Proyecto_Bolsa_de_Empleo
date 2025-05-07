const { Pool } = require('pg');
const dotenv = require('dotenv');
const usuarioController = require('../controllers/usuarioController');
const postulanteController = require('../controllers/postulanteController');
const empresaController = require('../controllers/empresaController');
const ofertaController = require('../controllers/ofertaController');
const postulacionController = require('../controllers/postulacionController');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

describe('Controlador de Postulacion', () => {
  test('Debe crear y buscar una postulacion por id', async () => {
    // Arrange - Crear usuario postulante
    const timestamp = Date.now();
    const usuarioPostulanteData = {
      nombre: 'Postulante',
      apellido: 'Test',
      correo: `postulante.test.${timestamp}@email.com`,
      contraseña: 'testpass',
      tipo_usuario: 'postulante'
    };
    const usuarioPostulante = await usuarioController.crearUsuario(usuarioPostulanteData);
    
    // Crear postulante
    const postulanteData = {
      id_postulante: usuarioPostulante.id_usuario,
      curriculum: 'CV de Prueba',
      experiencia_laboral: 'Sin experiencia',
      educacion: 'Secundaria',
      habilidades: 'Responsable',
      telefono: '555-0000',
      direccion: 'Calle Prueba 1'
    };
    await postulanteController.crearPostulante(postulanteData);

    // Crear usuario empresa
    const usuarioEmpresaData = {
      nombre: 'Empresa',
      apellido: 'Test',
      correo: `empresa.test.${timestamp + 1}@email.com`,
      contraseña: 'testpass',
      tipo_usuario: 'empresa'
    };
    const usuarioEmpresa = await usuarioController.crearUsuario(usuarioEmpresaData);

    // Crear empresa
    const empresaData = {
      id_empresa: usuarioEmpresa.id_usuario,
      nombre_empresa: 'Empresa Test',
      sector: 'Tecnología',
      descripcion: 'Empresa de prueba',
      sitio_web: 'www.test.com',
      telefono_contacto: '555-0001',
      direccion: 'Calle Empresa 1'
    };
    await empresaController.crearEmpresa(empresaData);

    // Crear oferta
    const ofertaData = {
      id_empresa: usuarioEmpresa.id_usuario,
      titulo: 'Oferta Test',
      descripcion: 'Descripción de prueba',
      requisitos: 'Requisitos de prueba',
      ubicacion: 'Ubicación de prueba',
      tipo_contrato: 'Tiempo completo',
      fecha_publicacion: new Date(),
      estado: 'activa'
    };
    const oferta = await ofertaController.crearOferta(ofertaData);

    // Crear postulación
    const data = {
      id_oferta: oferta.id_oferta,
      id_postulante: usuarioPostulante.id_usuario,
      fecha_postulacion: new Date(),
      estado: 'enviada',
      mensaje: 'Mensaje de prueba'
    };
    // Act
    const postulacion = await postulacionController.crearPostulacion(data);
    const encontrada = await postulacionController.buscarPorId(postulacion.id_postulacion);
    // Assert
    expect(postulacion).toHaveProperty('id_postulacion');
    expect(encontrada).not.toBeNull();
    expect(encontrada.id_postulacion).toBe(postulacion.id_postulacion);
  });
}); 
const usuarioController = require('../controllers/usuarioController');
const empresaController = require('../controllers/empresaController');
const ofertaController = require('../controllers/ofertaController');

describe('Controlador de Oferta', () => {
  test('Debe crear y buscar una oferta por id', async () => {
    // Arrange
    const usuarioData = {
      nombre: 'Empresa',
      apellido: 'Test',
      correo: 'empresa.oferta@email.com',
      contraseña: 'testpass',
      tipo_usuario: 'empresa'
    };
    const usuario = await usuarioController.crearUsuario(usuarioData);
    const empresaData = {
      id_empresa: usuario.id_usuario,
      nombre_empresa: 'Empresa Oferta',
      sector: 'Tecnología',
      descripcion: 'Empresa para test de oferta',
      sitio_web: 'https://oferta.com',
      telefono_contacto: '555-2222',
      direccion: 'Calle Oferta 3'
    };
    await empresaController.crearEmpresa(empresaData);
    const data = {
      id_empresa: usuario.id_usuario,
      titulo: 'Oferta Test',
      descripcion: 'Descripción de prueba',
      requisitos: 'Ninguno',
      ubicacion: 'Remoto',
      tipo_contrato: 'Temporal',
      fecha_publicacion: new Date(),
      estado: 'activa'
    };
    // Act
    const oferta = await ofertaController.crearOferta(data);
    const encontrada = await ofertaController.buscarPorId(oferta.id_oferta);
    // Assert
    expect(oferta).toHaveProperty('id_oferta');
    expect(encontrada).not.toBeNull();
    expect(encontrada.id_oferta).toBe(oferta.id_oferta);
  });
}); 
const usuarioController = require('../controllers/usuarioController');
const empresaController = require('../controllers/empresaController');

describe('Controlador de Empresa', () => {
  test('Debe crear y buscar una empresa por id', async () => {
    // Arrange
    const timestamp = Date.now();
    const usuarioData = {
      nombre: 'Empresa',
      apellido: 'Test',
      correo: `empresa.test.${timestamp}@email.com`,
      contraseña: 'testpass',
      tipo_usuario: 'empresa'
    };
    const usuario = await usuarioController.crearUsuario(usuarioData);
    const data = {
      id_empresa: usuario.id_usuario,
      nombre_empresa: 'Empresa Test',
      sector: 'Tecnología',
      descripcion: 'Empresa de prueba',
      sitio_web: 'www.test.com',
      telefono_contacto: '555-0001',
      direccion: 'Calle Empresa 1'
    };
    // Act
    const empresa = await empresaController.crearEmpresa(data);
    const encontrada = await empresaController.buscarPorId(data.id_empresa);
    // Assert
    expect(empresa).toHaveProperty('id_empresa');
    expect(encontrada).not.toBeNull();
    expect(encontrada.id_empresa).toBe(data.id_empresa);
  });
}); 
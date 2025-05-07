const empresaController = require('../../controllers/empresaController');

describe('Controlador de Empresa', () => {
  test('Debe crear y buscar una empresa por id', async () => {
    // Arrange
    const data = {
      id_empresa: 9998, // Usa un id poco probable para evitar conflictos
      nombre_empresa: 'Empresa Prueba',
      sector: 'Servicios',
      descripcion: 'Empresa de prueba para test',
      sitio_web: 'https://prueba.com',
      telefono_contacto: '555-1111',
      direccion: 'Calle Empresa 2'
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
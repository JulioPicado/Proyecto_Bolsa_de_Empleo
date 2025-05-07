const administradorController = require('../../controllers/administradorController');

describe('Controlador de Administrador', () => {
  test('Debe crear y buscar un administrador por id', async () => {
    // Arrange
    const data = {
      id_administrador: 9997, // Usa un id poco probable para evitar conflictos
      rol: 'adminTest'
    };
    // Act
    const administrador = await administradorController.crearAdministrador(data);
    const encontrado = await administradorController.buscarPorId(data.id_administrador);
    // Assert
    expect(administrador).toHaveProperty('id_administrador');
    expect(encontrado).not.toBeNull();
    expect(encontrado.id_administrador).toBe(data.id_administrador);
  });
}); 
const ofertaController = require('../../controllers/ofertaController');

describe('Controlador de Oferta', () => {
  test('Debe crear y buscar una oferta por id', async () => {
    // Arrange
    const data = {
      id_empresa: 9998, // Debe existir una empresa con este id
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
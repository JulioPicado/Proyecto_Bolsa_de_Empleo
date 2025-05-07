const postulacionController = require('../controllers/postulacionController');

describe('Controlador de Postulacion', () => {
  test('Debe crear y buscar una postulacion por id', async () => {
    // Arrange
    const data = {
      id_oferta: 1, // Debe existir una oferta con este id
      id_postulante: 9999, // Debe existir un postulante con este id
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
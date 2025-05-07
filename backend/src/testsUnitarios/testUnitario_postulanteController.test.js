const usuarioController = require('../controllers/usuarioController');
const postulanteController = require('../controllers/postulanteController');

describe('Controlador de Postulante', () => {
  test('Debe crear y buscar un postulante por id', async () => {
    // Arrange
    const timestamp = Date.now();
    const usuarioData = {
      nombre: 'Postulante',
      apellido: 'Test',
      correo: `postulante.test.${timestamp}@email.com`,
      contraseña: 'testpass',
      tipo_usuario: 'postulante'
    };
    const usuario = await usuarioController.crearUsuario(usuarioData);
    const data = {
      id_postulante: usuario.id_usuario,
      curriculum: 'CV de Prueba',
      experiencia_laboral: 'Sin experiencia',
      educacion: 'Secundaria',
      habilidades: 'Responsable',
      telefono: '555-0000',
      direccion: 'Calle Prueba 1'
    };
    // Act
    const postulante = await postulanteController.crearPostulante(data);
    const encontrado = await postulanteController.buscarPorId(data.id_postulante);
    // Assert
    expect(postulante).toHaveProperty('id_postulante');
    expect(encontrado).not.toBeNull();
    expect(encontrado.id_postulante).toBe(data.id_postulante);
  });
}); 
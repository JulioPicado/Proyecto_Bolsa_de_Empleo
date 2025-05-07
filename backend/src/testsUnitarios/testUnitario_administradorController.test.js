const { Pool } = require('pg');
const dotenv = require('dotenv');
const usuarioController = require('../controllers/usuarioController');
const administradorController = require('../controllers/administradorController');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

describe('Controlador de Administrador', () => {
  test('Debe crear y buscar un administrador por id', async () => {
    // Arrange
    const timestamp = Date.now();
    const usuarioData = {
      nombre: 'Admin',
      apellido: 'Test',
      correo: `admin.test.${timestamp}@email.com`,
      contraseña: 'testpass',
      tipo_usuario: 'administrador'
    };
    const usuario = await usuarioController.crearUsuario(usuarioData);
    
    const data = {
      id_administrador: usuario.id_usuario,
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
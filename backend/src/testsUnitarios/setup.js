const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

beforeEach(async () => {
  // Limpiar todas las tablas en orden inverso a sus dependencias
  await pool.query('DELETE FROM postulacion');
  await pool.query('DELETE FROM oferta');
  await pool.query('DELETE FROM postulante');
  await pool.query('DELETE FROM empresa');
  await pool.query('DELETE FROM administrador');
  await pool.query('DELETE FROM usuario');
});

afterAll(async () => {
  // Cerrar la conexión a la base de datos después de todos los tests
  await pool.end();
}); 
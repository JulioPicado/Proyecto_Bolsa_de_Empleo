const db = require('../config/database');
const Usuario = require('../models/usuario');

async function crearUsuario(data) {
  const result = await db.query(
    `INSERT INTO usuario (nombre, apellido, correo, contraseña, tipo_usuario)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.nombre, data.apellido, data.correo, data.contraseña, data.tipo_usuario]
  );
  return new Usuario(result.rows[0]);
}

async function buscarPorCorreo(correo) {
  const result = await db.query(
    `SELECT * FROM usuario WHERE correo = $1`,
    [correo]
  );
  return result.rows[0] ? new Usuario(result.rows[0]) : null;
}

async function buscarPorId(id_usuario) {
  const result = await db.query(
    `SELECT * FROM usuario WHERE id_usuario = $1`,
    [id_usuario]
  );
  return result.rows[0] ? new Usuario(result.rows[0]) : null;
}

async function obtenerTodos() {
  const result = await db.query('SELECT * FROM usuario');
  return result.rows.map(row => new Usuario(row));
}

async function actualizarUsuario(id_usuario, data) {
  const result = await db.query(
    `UPDATE usuario SET nombre = $1, apellido = $2, correo = $3, tipo_usuario = $4 WHERE id_usuario = $5 RETURNING *`,
    [data.nombre, data.apellido, data.correo, data.tipo_usuario, id_usuario]
  );
  return result.rows[0] ? new Usuario(result.rows[0]) : null;
}

async function eliminarUsuario(id_usuario) {
  await db.query(`DELETE FROM usuario WHERE id_usuario = $1`, [id_usuario]);
}

module.exports = {
  crearUsuario,
  buscarPorCorreo,
  buscarPorId,
  obtenerTodos,
  actualizarUsuario,
  eliminarUsuario
}; 
const db = require('../config/database');

// Crear un nuevo usuario
async function crearUsuario({ nombre, apellido, correo, contraseña, tipo_usuario }) {
  const result = await db.query(
    `INSERT INTO usuario (nombre, apellido, correo, contraseña, tipo_usuario)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nombre, apellido, correo, contraseña, tipo_usuario]
  );
  return result.rows[0];
}

// Buscar usuario por correo
async function buscarPorCorreo(correo) {
  const result = await db.query(
    `SELECT * FROM usuario WHERE correo = $1`,
    [correo]
  );
  return result.rows[0];
}

// Buscar usuario por id
async function buscarPorId(id_usuario) {
  const result = await db.query(
    `SELECT * FROM usuario WHERE id_usuario = $1`,
    [id_usuario]
  );
  return result.rows[0];
}

class Usuario {
  constructor({ id_usuario, nombre, apellido, correo, contraseña, tipo_usuario, fecha_registro }) {
    this.id_usuario = id_usuario;
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo = correo;
    this.contraseña = contraseña;
    this.tipo_usuario = tipo_usuario;
    this.fecha_registro = fecha_registro;
  }
}

module.exports = {
  crearUsuario,
  buscarPorCorreo,
  buscarPorId,
  Usuario
}; 
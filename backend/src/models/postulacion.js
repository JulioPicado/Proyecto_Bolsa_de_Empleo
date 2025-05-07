const db = require('../config/database');

// Crear una nueva postulacion
async function crearPostulacion({ id_oferta, id_postulante, fecha_postulacion, estado, mensaje }) {
  const result = await db.query(
    `INSERT INTO postulacion (id_oferta, id_postulante, fecha_postulacion, estado, mensaje)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [id_oferta, id_postulante, fecha_postulacion, estado, mensaje]
  );
  return result.rows[0];
}

// Buscar postulacion por id
async function buscarPorId(id_postulacion) {
  const result = await db.query(
    `SELECT * FROM postulacion WHERE id_postulacion = $1`,
    [id_postulacion]
  );
  return result.rows[0];
}

// Buscar postulaciones de un postulante
async function buscarPorPostulante(id_postulante) {
  const result = await db.query(
    `SELECT * FROM postulacion WHERE id_postulante = $1`,
    [id_postulante]
  );
  return result.rows;
}

// Buscar postulaciones de una oferta
async function buscarPorOferta(id_oferta) {
  const result = await db.query(
    `SELECT * FROM postulacion WHERE id_oferta = $1`,
    [id_oferta]
  );
  return result.rows;
}

class Postulacion {
  constructor({ id_postulacion, id_oferta, id_postulante, fecha_postulacion, estado, mensaje }) {
    this.id_postulacion = id_postulacion;
    this.id_oferta = id_oferta;
    this.id_postulante = id_postulante;
    this.fecha_postulacion = fecha_postulacion;
    this.estado = estado;
    this.mensaje = mensaje;
  }
}

module.exports = {
  crearPostulacion,
  buscarPorId,
  buscarPorPostulante,
  buscarPorOferta,
  Postulacion
}; 
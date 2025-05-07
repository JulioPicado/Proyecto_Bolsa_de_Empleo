const db = require('../config/database');
const Postulacion = require('../models/postulacion');

async function crearPostulacion(data) {
  const result = await db.query(
    `INSERT INTO postulacion (id_oferta, id_postulante, fecha_postulacion, estado, mensaje)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.id_oferta, data.id_postulante, data.fecha_postulacion, data.estado, data.mensaje]
  );
  return new Postulacion(result.rows[0]);
}

async function buscarPorId(id_postulacion) {
  const result = await db.query(
    `SELECT * FROM postulacion WHERE id_postulacion = $1`,
    [id_postulacion]
  );
  return result.rows[0] ? new Postulacion(result.rows[0]) : null;
}

async function buscarPorPostulante(id_postulante) {
  const result = await db.query(
    `SELECT * FROM postulacion WHERE id_postulante = $1`,
    [id_postulante]
  );
  return result.rows.map(row => new Postulacion(row));
}

async function buscarPorOferta(id_oferta) {
  const result = await db.query(
    `SELECT * FROM postulacion WHERE id_oferta = $1`,
    [id_oferta]
  );
  return result.rows.map(row => new Postulacion(row));
}

module.exports = {
  crearPostulacion,
  buscarPorId,
  buscarPorPostulante,
  buscarPorOferta
}; 
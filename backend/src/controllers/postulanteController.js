const db = require('../config/database');
const Postulante = require('../models/postulante');

async function crearPostulante(data) {
  const result = await db.query(
    `INSERT INTO postulante (id_postulante, curriculum, experiencia_laboral, educacion, habilidades, telefono, direccion)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [data.id_postulante, data.curriculum, data.experiencia_laboral, data.educacion, data.habilidades, data.telefono, data.direccion]
  );
  return new Postulante(result.rows[0]);
}

async function buscarPorId(id_postulante) {
  const result = await db.query(
    `SELECT * FROM postulante WHERE id_postulante = $1`,
    [id_postulante]
  );
  return result.rows[0] ? new Postulante(result.rows[0]) : null;
}

module.exports = {
  crearPostulante,
  buscarPorId
}; 
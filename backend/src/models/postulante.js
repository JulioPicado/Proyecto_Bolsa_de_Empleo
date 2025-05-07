const db = require('../config/database');

// Crear un nuevo postulante (después de crear usuario)
async function crearPostulante({ id_postulante, curriculum, experiencia_laboral, educacion, habilidades, telefono, direccion }) {
  const result = await db.query(
    `INSERT INTO postulante (id_postulante, curriculum, experiencia_laboral, educacion, habilidades, telefono, direccion)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [id_postulante, curriculum, experiencia_laboral, educacion, habilidades, telefono, direccion]
  );
  return result.rows[0];
}

// Buscar postulante por id
async function buscarPorId(id_postulante) {
  const result = await db.query(
    `SELECT * FROM postulante WHERE id_postulante = $1`,
    [id_postulante]
  );
  return result.rows[0];
}

class Postulante {
  constructor({ id_postulante, curriculum, experiencia_laboral, educacion, habilidades, telefono, direccion }) {
    this.id_postulante = id_postulante;
    this.curriculum = curriculum;
    this.experiencia_laboral = experiencia_laboral;
    this.educacion = educacion;
    this.habilidades = habilidades;
    this.telefono = telefono;
    this.direccion = direccion;
  }
}

module.exports = {
  crearPostulante,
  buscarPorId,
  Postulante
}; 
const db = require('../config/database');
const Oferta = require('../models/oferta');

async function crearOferta(data) {
  const result = await db.query(
    `INSERT INTO oferta (id_empresa, titulo, descripcion, requisitos, ubicacion, tipo_contrato, fecha_publicacion, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [data.id_empresa, data.titulo, data.descripcion, data.requisitos, data.ubicacion, data.tipo_contrato, data.fecha_publicacion, data.estado]
  );
  return new Oferta(result.rows[0]);
}

async function buscarPorId(id_oferta) {
  const result = await db.query(
    `SELECT * FROM oferta WHERE id_oferta = $1`,
    [id_oferta]
  );
  return result.rows[0] ? new Oferta(result.rows[0]) : null;
}

async function buscarPorEmpresa(id_empresa) {
  const result = await db.query(
    `SELECT * FROM oferta WHERE id_empresa = $1`,
    [id_empresa]
  );
  return result.rows.map(row => new Oferta(row));
}

module.exports = {
  crearOferta,
  buscarPorId,
  buscarPorEmpresa
}; 
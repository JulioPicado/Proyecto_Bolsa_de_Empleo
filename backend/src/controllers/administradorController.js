const db = require('../config/database');
const Administrador = require('../models/administrador');

async function crearAdministrador(data) {
  const result = await db.query(
    `INSERT INTO administrador (id_administrador, rol)
     VALUES ($1, $2) RETURNING *`,
    [data.id_administrador, data.rol]
  );
  return new Administrador(result.rows[0]);
}

async function buscarPorId(id_administrador) {
  const result = await db.query(
    `SELECT * FROM administrador WHERE id_administrador = $1`,
    [id_administrador]
  );
  return result.rows[0] ? new Administrador(result.rows[0]) : null;
}

module.exports = {
  crearAdministrador,
  buscarPorId
}; 
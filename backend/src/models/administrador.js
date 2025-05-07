const db = require('../config/database');

// Crear un nuevo administrador (después de crear usuario)
async function crearAdministrador({ id_administrador, rol }) {
  const result = await db.query(
    `INSERT INTO administrador (id_administrador, rol)
     VALUES ($1, $2) RETURNING *`,
    [id_administrador, rol]
  );
  return result.rows[0];
}

// Buscar administrador por id
async function buscarPorId(id_administrador) {
  const result = await db.query(
    `SELECT * FROM administrador WHERE id_administrador = $1`,
    [id_administrador]
  );
  return result.rows[0];
}

class Administrador {
  constructor({ id_administrador, rol }) {
    this.id_administrador = id_administrador;
    this.rol = rol;
  }
}

module.exports = {
  crearAdministrador,
  buscarPorId,
  Administrador
}; 
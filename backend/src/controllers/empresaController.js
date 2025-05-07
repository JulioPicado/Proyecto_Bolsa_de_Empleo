const db = require('../config/database');
const Empresa = require('../models/empresa');

async function crearEmpresa(data) {
  const result = await db.query(
    `INSERT INTO empresa (id_empresa, nombre_empresa, sector, descripcion, sitio_web, telefono_contacto, direccion)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [data.id_empresa, data.nombre_empresa, data.sector, data.descripcion, data.sitio_web, data.telefono_contacto, data.direccion]
  );
  return new Empresa(result.rows[0]);
}

async function buscarPorId(id_empresa) {
  const result = await db.query(
    `SELECT * FROM empresa WHERE id_empresa = $1`,
    [id_empresa]
  );
  return result.rows[0] ? new Empresa(result.rows[0]) : null;
}

module.exports = {
  crearEmpresa,
  buscarPorId
}; 
const db = require('../config/database');

// Crear una nueva empresa (después de crear usuario)
async function crearEmpresa({ id_empresa, nombre_empresa, sector, descripcion, sitio_web, telefono_contacto, direccion }) {
  const result = await db.query(
    `INSERT INTO empresa (id_empresa, nombre_empresa, sector, descripcion, sitio_web, telefono_contacto, direccion)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [id_empresa, nombre_empresa, sector, descripcion, sitio_web, telefono_contacto, direccion]
  );
  return result.rows[0];
}

// Buscar empresa por id
async function buscarPorId(id_empresa) {
  const result = await db.query(
    `SELECT * FROM empresa WHERE id_empresa = $1`,
    [id_empresa]
  );
  return result.rows[0];
}

class Empresa {
  constructor({ id_empresa, nombre_empresa, sector, descripcion, sitio_web, telefono_contacto, direccion }) {
    this.id_empresa = id_empresa;
    this.nombre_empresa = nombre_empresa;
    this.sector = sector;
    this.descripcion = descripcion;
    this.sitio_web = sitio_web;
    this.telefono_contacto = telefono_contacto;
    this.direccion = direccion;
  }
}

module.exports = Empresa; 
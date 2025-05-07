const db = require('../config/database');

// Crear una nueva oferta
async function crearOferta({ id_empresa, titulo, descripcion, requisitos, ubicacion, tipo_contrato, fecha_publicacion, estado }) {
  const result = await db.query(
    `INSERT INTO oferta (id_empresa, titulo, descripcion, requisitos, ubicacion, tipo_contrato, fecha_publicacion, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [id_empresa, titulo, descripcion, requisitos, ubicacion, tipo_contrato, fecha_publicacion, estado]
  );
  return result.rows[0];
}

// Buscar oferta por id
async function buscarPorId(id_oferta) {
  const result = await db.query(
    `SELECT * FROM oferta WHERE id_oferta = $1`,
    [id_oferta]
  );
  return result.rows[0];
}

// Buscar todas las ofertas de una empresa
async function buscarPorEmpresa(id_empresa) {
  const result = await db.query(
    `SELECT * FROM oferta WHERE id_empresa = $1`,
    [id_empresa]
  );
  return result.rows;
}

class Oferta {
  constructor({ id_oferta, id_empresa, titulo, descripcion, requisitos, ubicacion, tipo_contrato, fecha_publicacion, estado }) {
    this.id_oferta = id_oferta;
    this.id_empresa = id_empresa;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.requisitos = requisitos;
    this.ubicacion = ubicacion;
    this.tipo_contrato = tipo_contrato;
    this.fecha_publicacion = fecha_publicacion;
    this.estado = estado;
  }
}

module.exports = {
  crearOferta,
  buscarPorId,
  buscarPorEmpresa,
  Oferta
}; 
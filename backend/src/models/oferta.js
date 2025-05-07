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

module.exports = Oferta; 
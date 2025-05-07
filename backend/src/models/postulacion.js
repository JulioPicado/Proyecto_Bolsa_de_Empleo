class Postulacion {
  constructor({ id_postulacion, id_oferta, id_postulante, fecha_postulacion, estado, mensaje }) {
    this.id_postulacion = id_postulacion;
    this.id_oferta = id_oferta;
    this.id_postulante = id_postulante;
    this.fecha_postulacion = fecha_postulacion;
    this.estado = estado;
    this.mensaje = mensaje;
  }
}

module.exports = Postulacion; 
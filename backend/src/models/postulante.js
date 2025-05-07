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

module.exports = Postulante; 
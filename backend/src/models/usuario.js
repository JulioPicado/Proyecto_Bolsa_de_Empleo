class Usuario {
  constructor({ id_usuario, nombre, apellido, correo, contraseña, tipo_usuario, fecha_registro }) {
    this.id_usuario = id_usuario;
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo = correo;
    this.contraseña = contraseña;
    this.tipo_usuario = tipo_usuario;
    this.fecha_registro = fecha_registro;
  }
}

module.exports = Usuario; 
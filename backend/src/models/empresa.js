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
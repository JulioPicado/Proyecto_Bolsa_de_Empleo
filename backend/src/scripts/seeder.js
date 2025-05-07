const db = require('./config/database');
const bcrypt = require('bcryptjs');

async function runSeeder() {
  try {
    // Limpiar tablas (en orden por FK)
    await db.query('DELETE FROM postulacion');
    await db.query('DELETE FROM oferta');
    await db.query('DELETE FROM postulante');
    await db.query('DELETE FROM empresa');
    await db.query('DELETE FROM administrador');
    await db.query('DELETE FROM usuario');

    // Usuarios
    const password1 = await bcrypt.hash('password123', 10);
    const password2 = await bcrypt.hash('empresa456', 10);
    const password3 = await bcrypt.hash('admin789', 10);

    // Insertar postulante
    const usuarioPostulante = await db.query(
      `INSERT INTO usuario (nombre, apellido, correo, contraseña, tipo_usuario)
       VALUES ('Juan', 'Pérez', 'juan.perez@email.com', $1, 'postulante') RETURNING *`,
      [password1]
    );
    await db.query(
      `INSERT INTO postulante (id_postulante, curriculum, experiencia_laboral, educacion, habilidades, telefono, direccion)
       VALUES ($1, 'CV de Juan', '2 años en ventas', 'Lic. en Administración', 'Ventas, Comunicación', '555-1234', 'Calle Falsa 123')`,
      [usuarioPostulante.rows[0].id_usuario]
    );

    // Insertar empresa
    const usuarioEmpresa = await db.query(
      `INSERT INTO usuario (nombre, apellido, correo, contraseña, tipo_usuario)
       VALUES ('María', 'Gómez', 'contacto@acme.com', $1, 'empresa') RETURNING *`,
      [password2]
    );
    await db.query(
      `INSERT INTO empresa (id_empresa, nombre_empresa, sector, descripcion, sitio_web, telefono_contacto, direccion)
       VALUES ($1, 'ACME S.A.', 'Tecnología', 'Empresa líder en soluciones tecnológicas', 'https://acme.com', '555-5678', 'Av. Principal 456')`,
      [usuarioEmpresa.rows[0].id_usuario]
    );

    // Insertar administrador
    const usuarioAdmin = await db.query(
      `INSERT INTO usuario (nombre, apellido, correo, contraseña, tipo_usuario)
       VALUES ('Ana', 'López', 'admin@bolsaempleo.com', $1, 'administrador') RETURNING *`,
      [password3]
    );
    await db.query(
      `INSERT INTO administrador (id_administrador, rol)
       VALUES ($1, 'superadmin')`,
      [usuarioAdmin.rows[0].id_usuario]
    );

    // Insertar oferta
    const oferta = await db.query(
      `INSERT INTO oferta (id_empresa, titulo, descripcion, requisitos, ubicacion, tipo_contrato, estado)
       VALUES ($1, 'Desarrollador Web', 'Desarrollo de aplicaciones web', 'JavaScript, Node.js, Trabajo en equipo', 'Remoto', 'Tiempo completo', 'activa') RETURNING *`,
      [usuarioEmpresa.rows[0].id_usuario]
    );

    // Insertar postulacion
    await db.query(
      `INSERT INTO postulacion (id_oferta, id_postulante, estado, mensaje)
       VALUES ($1, $2, 'enviada', 'Estoy interesado en la vacante.')`,
      [oferta.rows[0].id_oferta, usuarioPostulante.rows[0].id_usuario]
    );

    console.log('¡Datos de ejemplo insertados correctamente!');
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar el seeder:', error);
    process.exit(1);
  }
}

runSeeder(); 
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');
const postulanteController = require('../controllers/postulanteController');
const empresaController = require('../controllers/empresaController');
const administradorController = require('../controllers/administradorController');

// Registro de postulante
router.post('/registro-postulante', async (req, res) => {
  try {
    const { nombre, apellido, correo, contraseña, curriculum, experiencia_laboral, educacion, habilidades, telefono, direccion } = req.body;
    const existe = await usuarioController.buscarPorCorreo(correo);
    if (existe) return res.status(400).json({ error: 'El correo ya está registrado' });
    const hash = await bcrypt.hash(contraseña, 10);
    const usuario = await usuarioController.crearUsuario({ nombre, apellido, correo, contraseña: hash, tipo_usuario: 'postulante' });
    const postulante = await postulanteController.crearPostulante({
      id_postulante: usuario.id_usuario,
      curriculum,
      experiencia_laboral,
      educacion,
      habilidades,
      telefono,
      direccion
    });
    res.status(201).json({ usuario, postulante });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registro de empresa
router.post('/registro-empresa', async (req, res) => {
  try {
    const { nombre, apellido, correo, contraseña, nombre_empresa, sector, descripcion, sitio_web, telefono_contacto, direccion } = req.body;
    const existe = await usuarioController.buscarPorCorreo(correo);
    if (existe) return res.status(400).json({ error: 'El correo ya está registrado' });
    const hash = await bcrypt.hash(contraseña, 10);
    const usuario = await usuarioController.crearUsuario({ nombre, apellido, correo, contraseña: hash, tipo_usuario: 'empresa' });
    const empresa = await empresaController.crearEmpresa({
      id_empresa: usuario.id_usuario,
      nombre_empresa,
      sector,
      descripcion,
      sitio_web,
      telefono_contacto,
      direccion
    });
    res.status(201).json({ usuario, empresa });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registro de administrador
router.post('/registro-administrador', async (req, res) => {
  try {
    const { nombre, apellido, correo, contraseña, rol } = req.body;
    const existe = await usuarioController.buscarPorCorreo(correo);
    if (existe) return res.status(400).json({ error: 'El correo ya está registrado' });
    const hash = await bcrypt.hash(contraseña, 10);
    const usuario = await usuarioController.crearUsuario({ nombre, apellido, correo, contraseña: hash, tipo_usuario: 'administrador' });
    const administrador = await administradorController.crearAdministrador({
      id_administrador: usuario.id_usuario,
      rol
    });
    res.status(201).json({ usuario, administrador });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login general
router.post('/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const usuario = await usuarioController.buscarPorCorreo(correo);
    if (!usuario) return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    const valido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!valido) return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, tipo_usuario: usuario.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    res.json({ usuario, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
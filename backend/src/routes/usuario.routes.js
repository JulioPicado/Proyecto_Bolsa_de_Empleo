const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await usuarioController.buscarPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener usuario por correo
router.get('/correo/:correo', async (req, res) => {
  try {
    const usuario = await usuarioController.buscarPorCorreo(req.params.correo);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear usuario (solo para pruebas, el registro real está en auth)
router.post('/', async (req, res) => {
  try {
    const usuario = await usuarioController.crearUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await usuarioController.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
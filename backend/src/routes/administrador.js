const express = require('express');
const router = express.Router();
const administradorController = require('../controllers/administradorController');

// Obtener administrador por ID
router.get('/:id', async (req, res) => {
  try {
    const administrador = await administradorController.buscarPorId(req.params.id);
    if (!administrador) return res.status(404).json({ error: 'Administrador no encontrado' });
    res.json(administrador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear administrador (solo para pruebas, el registro real está en auth)
router.post('/', async (req, res) => {
  try {
    const administrador = await administradorController.crearAdministrador(req.body);
    res.status(201).json(administrador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const postulanteController = require('../controllers/postulanteController');

// Obtener postulante por ID
router.get('/:id', async (req, res) => {
  try {
    const postulante = await postulanteController.buscarPorId(req.params.id);
    if (!postulante) return res.status(404).json({ error: 'Postulante no encontrado' });
    res.json(postulante);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear postulante (solo para pruebas, el registro real está en auth)
router.post('/', async (req, res) => {
  try {
    const postulante = await postulanteController.crearPostulante(req.body);
    res.status(201).json(postulante);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
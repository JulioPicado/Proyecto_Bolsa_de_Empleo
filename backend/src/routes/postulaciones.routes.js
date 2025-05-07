const express = require('express');
const router = express.Router();
const postulacionController = require('../controllers/postulacionController');

// Obtener postulacion por ID
router.get('/:id', async (req, res) => {
  try {
    const postulacion = await postulacionController.buscarPorId(req.params.id);
    if (!postulacion) return res.status(404).json({ error: 'Postulación no encontrada' });
    res.json(postulacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener postulaciones de un postulante
router.get('/postulante/:id_postulante', async (req, res) => {
  try {
    const postulaciones = await postulacionController.buscarPorPostulante(req.params.id_postulante);
    res.json(postulaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener postulaciones de una oferta
router.get('/oferta/:id_oferta', async (req, res) => {
  try {
    const postulaciones = await postulacionController.buscarPorOferta(req.params.id_oferta);
    res.json(postulaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear postulacion
router.post('/', async (req, res) => {
  try {
    const postulacion = await postulacionController.crearPostulacion(req.body);
    res.status(201).json(postulacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const ofertaController = require('../controllers/ofertaController');

// Obtener oferta por ID
router.get('/:id', async (req, res) => {
  try {
    const oferta = await ofertaController.buscarPorId(req.params.id);
    if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' });
    res.json(oferta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las ofertas de una empresa
router.get('/empresa/:id_empresa', async (req, res) => {
  try {
    const ofertas = await ofertaController.buscarPorEmpresa(req.params.id_empresa);
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear oferta
router.post('/', async (req, res) => {
  try {
    const oferta = await ofertaController.crearOferta(req.body);
    res.status(201).json(oferta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
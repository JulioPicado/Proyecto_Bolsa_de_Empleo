const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

// Obtener empresa por ID
router.get('/:id', async (req, res) => {
  try {
    const empresa = await empresaController.buscarPorId(req.params.id);
    if (!empresa) return res.status(404).json({ error: 'Empresa no encontrada' });
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear empresa (solo para pruebas, el registro real está en auth)
router.post('/', async (req, res) => {
  try {
    const empresa = await empresaController.crearEmpresa(req.body);
    res.status(201).json(empresa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
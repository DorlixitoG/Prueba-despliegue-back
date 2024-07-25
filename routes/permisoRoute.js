// routes/permisos.js
const express = require('express');
const router = express.Router();
const permisoModel = require('../models/permisoModel');

router.get('/', async (req, res) => {
  try {
    const permisos = await permisoModel.findAll();
    res.json(permisos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener permisos', error });
  }
});

module.exports = router;

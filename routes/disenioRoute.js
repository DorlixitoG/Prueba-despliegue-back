// Importa el paquete 'express' para crear y configurar el enrutador
const express = require('express');

// Crea un nuevo enrutador utilizando express.Router()
const router = express.Router();

// Importa el controlador de diseños que contiene las funciones para manejar las solicitudes relacionadas con los diseños
const disenioControllers = require('../controllers/disenioController');

// Define las diferentes rutas para el CRUD de diseños y las asocia con las funciones correspondientes del controlador

// Ruta para obtener todos los diseños
router.get('/', disenioControllers.consultar);

// Ruta para obtener un cliente por su ID
router.get('/:id', disenioControllers.consultarPorId);

// Ruta para crear un nuevo cliente
router.post('/', disenioControllers.agregar);

// Ruta para actualizar un cliente existente por su ID
router.put('/:id', disenioControllers.actualizar);

// Ruta para eliminar un cliente por su ID
router.delete('/:id', disenioControllers.eliminar);

// Exporta el enrutador para que pueda ser utilizado por otros archivos
module.exports = router;

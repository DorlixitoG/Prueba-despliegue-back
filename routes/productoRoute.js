// Importa el paquete 'express' para crear y configurar el enrutador
const express = require("express");

// Crea un nuevo enrutador utilizando express.Router()
const router = express.Router();

// Importa el controlador de producto que contiene las funciones para manejar las solicitudes relacionadas con el producto
const productoController = require("../controllers/productoController");

// Define las diferentes rutas para el producto y las asocia con las funciones correspondientes del controlador

// Ruta para obtener todos los productos
router.get("/", productoController.consultar);

// Ruta para obtener un producto por su ID
router.get("/:id", productoController.consultarPorId);

// Ruta para crear un nuevo producto
router.post("/", productoController.agregar);

// Ruta para actualizar un producto existente por su ID
router.put("/:id", productoController.actualizar);

// Ruta para eliminar un producto por su ID
router.delete("/:id", productoController.eliminar);

// Exporta el enrutador para que pueda ser utilizado por otros archivos
module.exports = router;

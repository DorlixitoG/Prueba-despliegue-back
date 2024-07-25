// Requerir los módulos necesarios
const express = require("express");
const router = express.Router();

// Requerir el controlador de clientes
const clienteControllers = require("../controllers/clienteController");

// Definir las rutas y asignarlas a funciones del controlador

// Ruta para obtener todos los clientes
router.get("/", clienteControllers.consultar);

// Ruta para obtener un cliente por su ID
router.get("/:id", clienteControllers.consultarPorId);

// Ruta para crear un nuevo cliente
router.post("/", clienteControllers.agregar);

// Ruta para actualizar un cliente existente
router.put("/:id", clienteControllers.actualizar);

// Ruta para eliminar un cliente por su ID
router.delete("/:id", clienteControllers.eliminar);

// Exportar el enrutador
module.exports = router;

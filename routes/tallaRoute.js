// Requerir los módulos necesarios
const express = require("express");
const router = express.Router();

// Requerir el controlador de talla
const tallaController = require("../controllers/tallaController");

// Definir las rutas y asignarlas a funciones del controlador

// Ruta para obtener todos los talla
router.get("/", tallaController.consultar);

// Ruta para obtener un cliente por su ID
router.get("/:id", tallaController.consultarPorId);

// Ruta para crear un nuevo cliente
router.post("/", tallaController.agregar);

// Ruta para actualizar un cliente existente
router.put("/:id", tallaController.actualizar);

// Ruta para eliminar un cliente por su ID
router.delete("/:id", tallaController.eliminar);

// Exportar el enrutador
module.exports = router;

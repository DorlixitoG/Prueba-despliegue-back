// Requerir los módulos necesarios
const express = require("express");
const router = express.Router();

// Requerir el controlador de color
const colorControllers = require("../controllers/colorController");

// Definir las rutas y asignarlas a funciones del controlador

// Ruta para obtener todos los color
router.get("/", colorControllers.consultar);

// Ruta para obtener un color por su ID
router.get("/:id", colorControllers.consultarPorId);

// Ruta para crear un nuevo color
router.post("/", colorControllers.agregar);

// Ruta para actualizar un color existente
router.put("/:id", colorControllers.actualizar);

// Ruta para eliminar un color por su ID
router.delete("/:id", colorControllers.eliminar);

// Exportar el enrutador
module.exports = router;

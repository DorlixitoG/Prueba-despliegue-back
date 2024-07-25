// Requerir los módulos necesarios
const express = require("express");
const router = express.Router();

// Requerir el controlador de roles
const rolControllers = require("../controllers/rolController");

// Definir las rutas y asignarlas a funciones del controlador

// Ruta para obtener todos los roles
router.get("/", rolControllers.consultar);

// Ruta para obtener un rol por su ID
router.get("/:id", rolControllers.consultarPorId);

// Ruta para crear un nuevo rol
router.post("/", rolControllers.agregar);

// Ruta para actualizar un rol existente
router.put("/:id", rolControllers.actualizar);

// Ruta para eliminar un rol por su ID
router.delete("/:id", rolControllers.eliminar);

router.delete("/:id", rolControllers.eliminar);

router.put("/estado/:id", rolControllers.actualizarEstado);

// Exportar el enrutador
module.exports = router;

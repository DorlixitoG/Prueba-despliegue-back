// Requerir los módulos necesarios
const express = require("express");
const router = express.Router();

// Requerir el controlador de usuarios
const usuarioControllers = require("../controllers/usuarioController");

// Definir las rutas y asignarlas a funciones del controlador

// Ruta para obtener todos los usuarios
router.get("/", usuarioControllers.consultar);

// Ruta para obtener un usuario por su ID
router.get("/:id", usuarioControllers.consultarPorId);

// Ruta para crear un nuevo usuario
router.post("/", usuarioControllers.agregar);

// Ruta para actualizar un usuario existente
router.put("/:id", usuarioControllers.actualizar);

// Ruta para eliminar un usuario por su ID
router.delete("/:id", usuarioControllers.eliminar);

// Exportar el enrutador
module.exports = router;

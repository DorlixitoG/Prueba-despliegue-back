// Requerir los módulos necesarios
const express = require("express");
const router = express.Router();

// Requerir el controlador de proveedores
const proveedorControllers = require("../controllers/proveedorController");

// Definir las rutas y asignarlas a funciones del controlador

// Ruta para obtener todos los proveedores
router.get("/", proveedorControllers.consultar);

// Ruta para obtener un proveedor por su ID
router.get("/:id", proveedorControllers.consultarPorId);

// Ruta para crear un nuevo proveedor
router.post("/", proveedorControllers.agregar);

// Ruta para actualizar un proveedor existente
router.put("/:id", proveedorControllers.actualizar);

// Ruta para eliminar un proveedor por su ID
router.delete("/:id", proveedorControllers.eliminar);

// Exportar el enrutador
module.exports = router;

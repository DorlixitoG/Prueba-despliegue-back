// Requerir los módulos necesarios
const express = require("express");
const router = express.Router();

// Requerir el controlador de color
const estadosPedidosControllers = require("../controllers/estadosPedidosController");

// Definir las rutas y asignarlas a funciones del controlador

// Ruta para obtener todos los color
router.get("/", estadosPedidosControllers.consultarEstadosPedidos);

// Exportar el enrutador
module.exports = router;

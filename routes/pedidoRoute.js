// Importa el paquete 'express' para crear y configurar el enrutador
const express = require("express");

// Crea un nuevo enrutador utilizando express.Router()
const router = express.Router();

// Importa el controlador de pedidos que contiene las funciones para manejar las solicitudes relacionadas con los pedidos
const pedidoControllers = require("../controllers/pedidoController");

// Define las diferentes rutas para los pedidos y las asocia con las funciones correspondientes del controlador

// Ruta para obtener todos los pedidos
router.get("/", pedidoControllers.obtenerPedidos);

// Ruta para obtener un pedido por su ID
router.get("/:id", pedidoControllers.consultarPorId);

// Ruta para crear un nuevo pedido
router.post("/", pedidoControllers.crearPedido);


// Ruta para eliminar un pedido por su ID
router.put("/:id", pedidoControllers.cambiarEstadoPedido);

// Exporta el enrutador para que pueda ser utilizado por otros archivos
module.exports = router;

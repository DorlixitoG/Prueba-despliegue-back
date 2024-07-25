const express = require("express");
const router = express.Router();
const compraController = require("../controllers/compraController");

// Ruta para buscar todas las compras
router.get("/", compraController.obtenerCompras);

// Ruta para buscar una compra por su ID
router.get("/:id", compraController.obtenerCompraPorId);

// Ruta para crear una nueva compra
router.post("/", compraController.crearCompra);

// Ruta para eliminar una compra por su ID
router.put("/:id", compraController.inhabilitarCompra);

module.exports = router;

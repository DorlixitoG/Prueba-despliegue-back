const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authMovilController");

// Ruta para autenticar al usuario
router.post("/", AuthController.autenticar);
router.post("/", AuthController.verificarToken);

module.exports = router;

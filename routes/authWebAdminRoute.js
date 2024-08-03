const express = require("express");
const router = express.Router();
const AuthWebController = require("../controllers/authWebController");

// Ruta para autenticar al usuario
router.post("/", AuthWebController.loginUsuario);
module.exports = router;

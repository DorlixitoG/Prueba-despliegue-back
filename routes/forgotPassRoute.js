const express = require("express");
const router = express.Router();
const forgotPassword = require("../controllers/forgotPassController");


// Ruta para solicitar el envío del correo de recuperación de contraseña
router.post("/", forgotPassword.forgotPassword);

module.exports = router;

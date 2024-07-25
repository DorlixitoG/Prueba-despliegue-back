const express = require("express");
const router = express.Router();
const resetPassword = require("../controllers/resetPasswordController");



// Ruta para restablecer la contraseña
router.post("/", resetPassword.resetPassword);

module.exports = router;
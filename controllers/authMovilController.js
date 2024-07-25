// AuthController.js
const usuarioModel = require("../models/usuarioModel");

const autenticar = async (req, res) => {
  try {
    const { Usuario, Contrasenia } = req.body;

    // Validar que los campos no estén vacíos
    if (!Usuario || !Contrasenia) {
      return res.status(400).json({ success: false, message: "Usuario y contraseña son requeridos" });
    }

    // Buscar el usuario por nombre de usuario y contraseña
    const usuario = await usuarioModel.findOne({
      where: { Usuario, Contrasenia }
    });

    if (usuario) {
      res.status(200).json({ success: true, message: "Inicio de sesión exitoso" });
    } else {
      res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
    }
  } catch (error) {
    console.error("Error al autenticar al usuario:", error);
    res.status(500).json({ success: false, message: "Error al autenticar al usuario" });
  }
};

module.exports = { autenticar };

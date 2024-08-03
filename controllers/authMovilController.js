// AuthController.js
const usuarioModel = require("../models/usuarioModel");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY; 
require('dotenv').config();

const autenticar = async (req, res) => {
  try {
    const { Usuario, Contrasenia } = req.body;

    if (!Usuario || !Contrasenia) {
      return res.status(400).json({ success: false, message: "Usuario y contraseña son requeridos" });
    }

    const usuario = await usuarioModel.findOne({
      where: { Usuario, Contrasenia }
    });

    if (usuario) {
      // Generar token
      const token = jwt.sign({ Usuario: usuario.Usuario }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ success: true, message: "Inicio de sesión exitoso", token });
    } else {
      res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
    }
  } catch (error) {
    console.error("Error al autenticar al usuario:", error);
    res.status(500).json({ success: false, message: "Error al autenticar al usuario" });
  }
};

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ success: false, message: "Token requerido" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Token inválido" });
    }

    req.usuario = decoded;
    next();
  });
};

module.exports = { autenticar, verificarToken };
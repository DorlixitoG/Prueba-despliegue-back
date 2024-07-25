const nodemailer = require('nodemailer');
const usuarioModel = require("../models/usuarioModel");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const forgotPassword = async (req, res) => {
  try {
    const { Correo } = req.body;

    if (!Correo) {
      return res.status(400).json({ success: false, message: "El correo electrónico es requerido" });
    }

    const usuario = await usuarioModel.findOne({ where: { Correo } });

    if (usuario) {
      const resetCode = generateResetCode();

      await usuarioModel.update(
        { resetCode },
        { where: { Correo } }
      );

      await transporter.sendMail({
        to: Correo,
        from: process.env.EMAIL_USER,
        subject: 'Recuperación de Contraseña',
        text: `Aquí está tu código de recuperación: ${resetCode}`
      });

      res.status(200).json({ success: true, resetCode, message: "Código de recuperación enviado" }); // Incluye resetCode en la respuesta
    } else {
      res.status(404).json({ success: false, message: "Correo electrónico no encontrado" });
    }
  } catch (error) {
    console.error("Error al enviar el correo de recuperación:", error);
    res.status(500).json({ success: false, message: "Error al enviar el correo de recuperación" });
  }
};

module.exports = { forgotPassword };

const usuarioModel = require("../models/usuarioModel");

const resetPassword = async (req, res) => {
  try {
    const { nuevaContrasenia, Correo } = req.body;

    // Verificar que la nueva contraseña y el correo estén presentes
    if (!nuevaContrasenia || !Correo) {
      return res.status(400).json({ success: false, message: "La nueva contraseña y el correo electrónico son requeridos" });
    }

    const usuario = await usuarioModel.findOne({ where: { Correo } });

    if (!usuario) {
      return res.status(400).json({ success: false, message: "Usuario no encontrado" });
    }

    // Actualizar la contraseña del usuario
    await usuarioModel.update(
      { Contrasenia: nuevaContrasenia },
      { where: { Correo } }
    );

    res.status(200).json({ success: true, message: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ success: false, message: "Error al restablecer la contraseña" });
  }
};

module.exports = { resetPassword };

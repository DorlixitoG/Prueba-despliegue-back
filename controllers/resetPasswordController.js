const usuarioModel = require("../models/usuarioModel");

const resetPassword = async (req, res) => {
  try {
    const { nuevaContrasenia } = req.body;

    // Verificar que la nueva contraseña esté presente
    if (!nuevaContrasenia) {
      return res.status(400).json({ success: false, message: "La nueva contraseña es requerida" });
    }

    // Aquí, necesitarás definir cómo identificar al usuario que está cambiando la contraseña.
    // Por simplicidad, supongamos que solo tienes un usuario para este ejemplo:
    const usuario = await usuarioModel.findOne(); // Cambia esto según tu lógica de autenticación

    if (!usuario) {
      return res.status(400).json({ success: false, message: "Usuario no encontrado" });
    }

    // Actualizar la contraseña del usuario
    await usuarioModel.update(
      { Contrasenia: nuevaContrasenia },
      { where: { IdUsuario: usuario.IdUsuario } } // Usa 'IdUsuario' en lugar de 'id'
    );

    res.status(200).json({ success: true, message: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ success: false, message: "Error al restablecer la contraseña" });
  }
};

module.exports = { resetPassword };

const usuarioModel = require("../models/usuarioModel");
const rolModel = require("../models/rolModel");

// Consultar todos los usuarios
const consultar = async (req, res) => {
  try {
    const usuarios = await usuarioModel.findAll({
      include: {
        model: rolModel,
        attributes: ['NombreRol']
      }
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.log("Error al consultar la tabla de usuarios:", error);
    res.status(500).json({ error: "Error al consultar la tabla de usuarios" });
  }
};

// Consultar un usuario por su ID
const consultarPorId = async (req, res) => {
  try {
    const idUsuario = req.params.id;
    const usuario = await usuarioModel.findByPk(idUsuario, {
      include: {
        model: rolModel,
        attributes: ['NombreRol']
      }
    });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.log("Error al consultar el usuario por ID:", error);
    res.status(500).json({ error: "Error al consultar el usuario por ID" });
  }
};

// Agregar un nuevo usuario
const agregar = async (req, res) => {
  try {
    const {
      IdRol,
      Usuario,
      Correo,
      Contrasenia, 
      Estado,
    } = req.body;

    // Verificar si los datos requeridos están presentes
    if (!Correo) {
      return res.status(400).json({ message: "El correo electrónico es requerido" });
    }

    // Verificar si ya existe un usuario con el mismo correo
    const usuarioExistenteCorreo = await usuarioModel.findOne({ where: { Correo } });

    if (usuarioExistenteCorreo) {
      return res.status(400).json({ message: `Ya existe un usuario con el correo electrónico ${Correo}` });
    }

    const nuevoUsuario = await usuarioModel.create({
      IdRol,
      Usuario,
      Correo,
      Contrasenia,
      Estado,
    });

    res.status(201).json({ message: "Usuario agregado exitosamente", nuevoUsuario });
  } catch (error) {
    console.error("Error al agregar el usuario:", error);
    res.status(500).json({ message: "Error al agregar el usuario" });
  }
};

// Actualizar un usuario
const actualizar = async (req, res) => {
  try {
    const {
      IdRol,
      Usuario,
      Correo,
      Contrasenia,
      Estado,
    } = req.body;
    const idUsuario = req.params.id;

    const usuario = await usuarioModel.findByPk(idUsuario);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Validar si se está proporcionando una nueva contraseña y actualizar si es así
    if (Contrasenia) {
      await usuario.update({
        IdRol,
        Usuario,
        Correo,
        Contrasenia, // Esto actualizará la contraseña si se proporciona
        Estado,
      });
    } else {
      // Si no se proporciona Contrasenia, actualizar sin incluirla en la actualización
      await usuario.update({
        IdRol,
        Usuario,
        Correo,
        Estado,
      });
    }

    res.json({ message: "Usuario actualizado exitosamente", usuario });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};


// Eliminar un usuario
const eliminar = async (req, res) => {
  try {
    const idUsuario = req.params.id;
    const usuario = await usuarioModel.findByPk(idUsuario);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await usuario.destroy();
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario: ", error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

module.exports = { consultar, consultarPorId, agregar, actualizar, eliminar };

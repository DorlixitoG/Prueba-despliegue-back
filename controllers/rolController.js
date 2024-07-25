const sequelize = require("sequelize");
const db = require("../db");
const rolModel = require("../models/rolModel");
const permisoModel = require("../models/permisoModel");
const rolPermisoModel = require("../models/RolesPermisos"); // Corregido el nombre del modelo

// Consultar todos los roles
const consultar = async (req, res) => {
  try {
    const roles = await rolModel.findAll({
      include: [
        {
          model: permisoModel,
          as: "Permisos",
          through: { attributes: [] }, // Para evitar traer la tabla intermedia
        },
      ],
    });
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error al consultar la tabla de roles:", error);
    res.status(500).json({ error: "Error al consultar la tabla de roles" });
  }
};

// Consultar un rol por su ID
const consultarPorId = async (req, res) => {
  try {
    const idRol = req.params.id;
    const rol = await rolModel.findByPk(idRol, {
      include: [
        {
          model: permisoModel,
          as: "Permisos",
          through: { attributes: [] }, // Para evitar traer la tabla intermedia
        },
      ],
    });
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    res.status(200).json(rol);
  } catch (error) {
    console.error("Error al consultar el rol por ID:", error);
    res.status(500).json({ error: "Error al consultar el rol por ID" });
  }
};

// Agregar un nuevo rol y sus permisos
// Agregar un nuevo rol y sus permisos
const agregar = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const { NombreRol, Estado, Permisos } = req.body;

    // Verificar si ya existe un rol con el mismo nombre
    const rolExistente = await rolModel.findOne({ where: { NombreRol } });
    if (rolExistente) {
      return res
        .status(400)
        .json({ message: "El nombre del rol ya está en uso" });
    }

    // Validar que se hayan seleccionado permisos
    if (!Permisos || Permisos.length === 0) {
      return res
        .status(400)
        .json({ message: "Debe seleccionar al menos un permiso para el rol" });
    }

    // Crear el nuevo rol
    const nuevoRol = await rolModel.create(
      {
        NombreRol,
        Estado,
      },
      {
        include: [
          {
            model: permisoModel,
            as: "Permisos",
          },
        ],
        transaction,
      }
    );

    // Asociar los permisos al nuevo rol
    const permisosData = Permisos.map((idPermiso) => ({
      IdRol: nuevoRol.IdRol,
      IdPermiso: idPermiso,
    }));

    await rolPermisoModel.bulkCreate(permisosData, { transaction });

    // Confirmar la transacción
    await transaction.commit();

    res.status(201).json({
      message: "Rol y permisos agregados exitosamente",
      nuevoRol,
    });
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();

    console.error("Error al agregar el rol y permisos:", error);
    res.status(500).json({ message: "Error al agregar el rol y permisos" });
  }
};


// Actualizar un rol y sus permisos
const actualizar = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const { NombreRol, Estado, Permisos } = req.body;
    const idRol = req.params.id;

    const rol = await rolModel.findByPk(idRol);
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    // Verificar si ya existe otro rol con el mismo nombre
    const rolExistente = await rolModel.findOne({
      where: { NombreRol, IdRol: { [sequelize.Op.ne]: idRol } },
    });
    if (rolExistente) {
      return res
        .status(400)
        .json({ message: "El nombre del rol ya está en uso" });
    }

    await rol.update(
      {
        NombreRol,
        Estado,
      },
      { transaction }
    );

    // Actualizar los permisos
    await rolPermisoModel.destroy({
      where: { IdRol: idRol },
      transaction,
    });

    if (Permisos && Permisos.length > 0) {
      const permisosData = Permisos.map((idPermiso) => ({
        IdRol: idRol,
        IdPermiso: idPermiso,
      }));

      await rolPermisoModel.bulkCreate(permisosData, { transaction });
    }

    // Confirmar la transacción
    await transaction.commit();

    res.json({ message: "Rol y permisos actualizados exitosamente", rol });
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();

    console.error("Error al actualizar el rol y permisos:", error);
    res.status(500).json({ message: "Error al actualizar el rol y permisos" });
  }
};

// Eliminar un rol
const eliminar = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const idRol = req.params.id;
    const rol = await rolModel.findByPk(idRol);
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    await rolPermisoModel.destroy({
      where: { IdRol: idRol },
      transaction,
    });

    await rol.destroy({ transaction });

    // Confirmar la transacción
    await transaction.commit();

    res.json({ message: "Rol y permisos eliminados exitosamente" });
  } catch (error) {
    // Revertir la transacción en caso de error
    await transaction.rollback();

    console.error("Error al eliminar el rol y permisos:", error);
    res.status(500).json({ message: "Error al eliminar el rol y permisos" });
  }
};

// Actualizar solo el estado de un rol
const actualizarEstado = async (req, res) => {
  try {
    const idRol = req.params.id;
    const { Estado } = req.body;

    const rol = await rolModel.findByPk(idRol);
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    await rol.update({ Estado });

    res.json({ message: "Estado del rol actualizado exitosamente", rol });
  } catch (error) {
    console.error("Error al actualizar el estado del rol:", error);
    res.status(500).json({ message: "Error al actualizar el estado del rol" });
  }
};

module.exports = {
  consultar,
  consultarPorId,
  agregar,
  actualizar,
  eliminar,
  actualizarEstado,
};

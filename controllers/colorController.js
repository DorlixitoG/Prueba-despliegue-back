const colorModel = require("../models/colorModel");

const consultar = async (req, res) => {
  try {
    const colores = await colorModel.findAll();
    res.status(200).json(colores);
  } catch (error) {
    console.log("Error al consultar la tabla de colores: ", error);
    res.status(500).json({ error: "Error al consultar la tabla de colores" });
  }
};

const consultarPorId = async (req, res) => {
  try {
    const IdColor = req.params.id;
    const colores = await colorModel.findByPk(IdColor);
    if (!colores) {
      return res.status(400).json({ message: "color no encontrado" });
    }
    res.status(200).json(colores);
  } catch (error) {
    console.log("Error al consultar el color por ID: ", error);
    res.status(500).json({ error: "Error al consultar el color por ID" });
  }
};

const agregar = async (req, res) => {
  try {
    const { Color, Referencia, Estado } = req.body;

    const colorExistente = await colorModel.findOne({
      where: { Color },
    });

    if (colorExistente) {
      return res.status(400).json({
        message: `Ya existe un color ${Color}`,
      });
    }

    // Validar que el campo Color contenga solo texto
    if (!/^[a-zA-Z\s]+$/.test(Color)) {
      return res.status(400).json({ message: "El campo Color solo puede contener texto" });
    }

    // Validar que el campo Referencia contenga un formato hexadecimal
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(Referencia)) {
      return res.status(400).json({ message: "El campo Referencia debe ser un formato hexadecimal" });
    }

    const nuevoColor = await colorModel.create({
      Color,
      Referencia,
      Estado,
    });

    res.json({ message: "color agregado exitosamente", nuevoColor });
  } catch (error) {
    console.error("Error al agregar el cliente: ", error);
    res.status(500).json({ message: "Error al agregar el color" });
  }
};

const actualizar = async (req, res) => {
  try {
    const IdColor = req.params.id;
    const { Color, Referencia,Estado } = req.body;

    const color = await colorModel.findByPk(IdColor);
    if (!color) {
      return res.status(404).json({ message: "color no encontrado" });
    }

    if (!/^[a-zA-Z\s]+$/.test(Color)) {
      return res.status(400).json({ message: "El campo Color solo puede contener texto" });
    }

    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(Referencia)) {
      return res.status(400).json({ message: "El campo Referencia debe ser un formato hexadecimal" });
    }

    await color.update({
      Color,
      Referencia,
      Estado,
    });

    res.json({ message: "color actualizado exitosamente", color });
  } catch (error) {
    console.log("Error al actualizar el color: ", error);
    res.status(500).json({ message: "Error al actualizar el color" });
  }
};

const eliminar = async (req, res) => {
  try {
    const IdColor = req.params.id;
    const color = await colorModel.findByPk(IdColor);
    if (!color) {
      return res.status(404).json({ message: "color no encontrado" });
    }
    await color.destroy();
    res.json({ message: "color eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el color: ", error);
    res.status(500).json({ message: "Error al eliminar el color" });
  }
};

module.exports = { consultar, consultarPorId, agregar, actualizar, eliminar };

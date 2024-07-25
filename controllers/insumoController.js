const insumoModel = require("../models/insumoModel");
const colorModel = require("../models/colorModel");
const tallaModel = require("../models/tallaModel");

// Función para consultar todos los insumos
const consultar = async (req, res) => {
  try {
    const insumos = await insumoModel.findAll(); // Busca todos los insumos en la base de datos
    res.status(200).json(insumos); // Responde con los insumos encontrados
  } catch (error) {
    console.log("Error al consultar los insumos: ", error);
    res.status(500).json({ message: "Error al consultar los insumos" });
  }
};

// Función para consultar un insumo por su ID
const consultarPorId = async (req, res) => {
  try {
    const idInsumo = req.params.id; // Obtiene el ID del insumo de los parámetros de la solicitud
    const insumo = await insumoModel.findByPk(idInsumo); // Busca el insumo por su ID
    if (!insumo) {
      // Si no se encuentra el insumo, responde con un mensaje de error
      return res.status(404).json({ message: "Insumo no encontrado" });
    }
    res.status(200).json(insumo); // Responde con el insumo encontrado
  } catch (error) {
    console.error("Error al consultar el insumo por el ID: ", error);
    res.status(500).json({ message: "Error al consultar el insumo por ID" });
  }
};

// Función para agregar un nuevo insumo
const agregar = async (req, res) => {
  try {
    // Extrae los datos del cuerpo de la solicitud
    const { IdColor, IdTalla, Referencia, Cantidad, ValorCompra, Estado } = req.body;

    // Validar campos vacíos
    if (!IdColor || !IdTalla || !Referencia) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Validar referencia según el formato requerido (AAA-000)
    const referenciaRegex = /^[A-Z]{3}-\d{3}$/;
    if (!referenciaRegex.test(Referencia)) {
      return res.status(400).json({ message: "La referencia debe tener el formato correcto: AAA-000" });
    }

    // Verificar si la referencia ya existe
    const insumoExistente = await insumoModel.findOne({ where: { Referencia } });
    if (insumoExistente) {
      return res.status(409).json({ message: "Ya existe un insumo con esa referencia" });
    }

    // Verificar si el color especificado existe
    const colorExistente = await colorModel.findByPk(IdColor);
    if (!colorExistente) {
      return res.status(404).json({ message: "El color especificado no existe" });
    }

    // Verificar si la talla especificada existe
    const tallaExistente = await tallaModel.findByPk(IdTalla);
    if (!tallaExistente) {
      return res.status(404).json({ message: "La talla especificada no existe" });
    }

    // Crear un nuevo insumo en la base de datos
    const nuevoInsumo = await insumoModel.create({
      IdColor,
      IdTalla,
      Referencia,
      Cantidad,
      ValorCompra,
      Estado,
    });

    // Responder con el nuevo insumo creado
    res.status(201).json({ message: "Insumo agregado exitosamente", nuevoInsumo });
  } catch (error) {
    console.error("Error al agregar el insumo:", error);
    res.status(500).json({ message: "Error al agregar el insumo" });
  }
};

// Función para actualizar un insumo existente
const actualizar = async (req, res) => {
  try {
    const idInsumo = req.params.id; // Obtiene el ID del insumo de los parámetros de la solicitud
    const { IdColor, IdTalla, Referencia, Cantidad, ValorCompra, Estado } = req.body; // Obtiene los datos actualizados del cuerpo de la solicitud

    // Verificar si el insumo existe
    const insumoExistente = await insumoModel.findByPk(idInsumo);
    if (!insumoExistente) {
      return res.status(404).json({ message: "Insumo no encontrado" });
    }

    // Validar campos vacíos
    if (!IdColor || !IdTalla || !Referencia) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Validar referencia según el formato requerido (AAA-000)
    const referenciaRegex = /^[A-Z]{3}-\d{3}$/;
    if (!referenciaRegex.test(Referencia)) {
      return res.status(400).json({ message: "La referencia debe tener el formato correcto: AAA-000" });
    }

    // Verificar si el color especificado existe
    const colorExistente = await colorModel.findByPk(IdColor);
    if (!colorExistente) {
      return res.status(404).json({ message: "El color especificado no existe" });
    }

    // Verificar si la talla especificada existe
    const tallaExistente = await tallaModel.findByPk(IdTalla);
    if (!tallaExistente) {
      return res.status(404).json({ message: "La talla especificada no existe" });
    }

    // Actualizar el insumo con los datos proporcionados
    await insumoExistente.update({
      IdColor,
      IdTalla,
      Referencia,
      Cantidad,
      ValorCompra,
      Estado,
    });

    res.status(200).json({ message: "Insumo actualizado correctamente" }); // Responde con un mensaje de éxito
  } catch (error) {
    console.error("Error al actualizar el insumo: ", error);
    res.status(500).json({ message: "Error al actualizar el insumo" });
  }
};

// Función para eliminar un insumo existente
const eliminar = async (req, res) => {
  try {
    const idInsumo = req.params.id;
    const insumoExistente = await insumoModel.findByPk(idInsumo);
    if (!insumoExistente) {
      return res.status(404).json({ message: "Insumo no encontrado" });
    }

    await insumoExistente.destroy();
    res.status(200).json({ message: "Insumo eliminado correctamente" });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ message: "No se puede eliminar el insumo porque está asociado a una compra" });
    }
    console.error("Error al eliminar el insumo: ", error);
    res.status(500).json({ message: "Error al eliminar el insumo" });
  }
};

module.exports = { consultar, consultarPorId, agregar, actualizar, eliminar };

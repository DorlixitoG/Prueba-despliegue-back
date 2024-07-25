// Importar el modelo de talla
const { where } = require("sequelize");
const {Op} = require("sequelize");
const tallaModel = require("../models/tallaModel");

// Consultar todos los tallas
const consultar = async (req, res) => {
  try {
    // Buscar todos los tallas en la base de datos
    const tallas = await tallaModel.findAll();
    // Responder con los tallas encontrados
    res.status(200).json(tallas);
  } catch (error) {
    // Manejar cualquier error que ocurra durante la consulta
    console.log("Error al consultar la tabla de tallas: ", error);
    res
      .status(500)
      .json({ error: "Error al consultar la tabla de tallas", error });
  }
};

// Consultar un talla por su ID
const consultarPorId = async (req, res) => {
  try {
    // Obtener el ID del talla de los parámetros de la solicitud
    const IdTalla = req.params.id;
    // Buscar el talla por su ID en la base de datos
    const talla = await tallaModel.findByPk(IdTalla);
    // Verificar si el talla existe
    if (!talla) {
      return res.status(400).json({ message: "talla no encontrado" });
    }
    // Responder con el talla encontrado
    res.status(200).json(talla);
  } catch (error) {
    // Manejar cualquier error que ocurra durante la consulta
    console.log("Error al consultar el talla por ID: ", error);
    res
      .status(500)
      .json({ error: "Error al consultar el talla por ID", error });
  }
};

// Agregar un nuevo talla
const agregar = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { Talla } = req.body;

    const tallaUnica = await tallaModel.findOne({ where: { Talla } });

    if (tallaUnica) {
      res.status(400).json({ message: `La talla ${Talla} ya existe` });
    } else {
      // Crear un nuevo talla con los datos proporcionados
      const nuevotalla = await tallaModel.create({
        Talla,
      });

      // Devolver una respuesta exitosa con el talla recién creado
      res.json({ message: "Talla agregada exitosamente", nuevotalla });
    }

  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso de creación del talla
    console.error("Error al agregar la talla: ", error);
    //quite el error de message
    res.status(500).json({ error: error.errors[0].message });
  }
};

// Actualizar un talla
const actualizar = async (req, res) => {
  try {
    // Obtener el ID del talla de los parámetros de la solicitud
    const IdTalla = req.params.id;
    // Extraer los datos actualizados del cuerpo de la solicitud
    const { Talla ,Estado} = req.body;

    const tallaMayus=Talla.toUpperCase();

    // Buscar el talla por su ID en la base de datos
    const talla = await tallaModel.findByPk(IdTalla);


    // Verificar si el talla existe
    if (!talla) {
      return res.status(404).json({ message: "talla no encontrado" });
    }
    else{

      // Validar que el campo talla contenga solo texto
      if (tallaMayus.length < 1 || tallaMayus.length > 7) {
      return res.status(400).json({ message: "El campo talla debe tener entre 1 y 5 letras" });
      }

      if (!/^[A-Z]+$/.test(tallaMayus)) {
        return res.status(400).json({ message: "El campo talla solo puede contener texto" });
        }


      const tallaUnica = await tallaModel.findOne({ where: { Talla: tallaMayus, IdTalla: { [Op.ne]: talla.IdTalla } } });

      if (tallaUnica) {
        res.status(400).json({ message: `La talla ${tallaMayus} ya existe` });

      } else {
      
        // Actualizar el talla con los nuevos datos
        await talla.update({
          Talla: tallaMayus,
          Estado
        });


        // Responder con un mensaje de éxito y el talla actualizado
        res.json({ message: "Talla actualizada exitosamente", talla });
      }

    }


  } catch (error) {
    // Manejar cualquier error que ocurra durante la actualización del talla
    console.log("Error al actualizar la talla: ", error);
    res.status(500).json({ error: error.errors[0].message });
  }
};

// Eliminar un talla
const eliminar = async (req, res) => {
  try {
    // Obtener el ID del talla de los parámetros de la solicitud
    const IdTalla = req.params.id;
    // Buscar el talla por su ID en la base de datos
    const talla = await tallaModel.findByPk(IdTalla);
    // Verificar si el talla existe
    if (!talla) {
      return res.status(404).json({ message: "talla no encontrado" });
    }
    // Eliminar el talla de la base de datos
    await talla.destroy();
    // Responder con un mensaje de éxito
    res.json({ message: "Talla eliminada exitosamente" });
  } catch (error) {
    // Manejar cualquier error que ocurra durante la eliminación del talla
    console.error("Error al eliminar la talla: ", error);
    res.status(500).json({ message: "Error al eliminar la talla" });
  }
};

// Exportar los controladores para su uso en otras partes de la aplicación
module.exports = { consultar, consultarPorId, agregar, actualizar, eliminar };

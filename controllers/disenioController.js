// Importar el modelo de Cliente
const disenioModel = require("../models/disenioModel");

// Consultar todos los clientes
const consultar = async (req, res) => {
  try {
    // Buscar todos los clientes en la base de datos
    const clientes = await disenioModel.findAll();
    // Responder con los clientes encontrados
    res.status(200).json(clientes);
  } catch (error) {
    // Manejar cualquier error que ocurra durante la consulta
    res
      .status(500)
      .json({ error: "Error al consultar la tabla de diseños", error });
  }
};

// Consultar un cliente por su ID
const consultarPorId = async (req, res) => {
  try {
    // Obtener el ID del cliente de los parámetros de la solicitud
    const IdDisenio = req.params.id;
    // Buscar el cliente por su ID en la base de datos
    const cliente = await disenioModel.findByPk(IdDisenio);
    // Verificar si el cliente existe
    if (!cliente) {
      return res.status(400).json({ message: "Diseño no encontrado" });
    }
    // Responder con el cliente encontrado
    res.status(200).json(cliente);
  } catch (error) {
    // Manejar cualquier error que ocurra durante la consulta
    res
      .status(500)
      .json({ error: "Error al consultar el Diseño por ID", error });
  }
};

// Agregar un nuevo cliente
const agregar = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const {
      NombreDisenio,
      Fuente,
      TamanioFuente,
      ColorFuente,
      PosicionFuente,
      TamanioImagen,
      PosicionImagen,
      PrecioDisenio,      
      IdImagenDisenio,
      ImagenDisenio,
      IdImagenReferencia,
      ImagenReferencia,
      Estado
    } = req.body;

    // Crear un nuevo cliente con los datos proporcionados
    const nuevoDisenio = await disenioModel.create({
      NombreDisenio,
      Fuente,
      TamanioFuente,
      ColorFuente,
      PosicionFuente,
      TamanioImagen,
      PosicionImagen,
      PrecioDisenio,
      IdImagenDisenio,
      ImagenDisenio,
      IdImagenReferencia,
      ImagenReferencia,
      Estado
    });

    // Devolver una respuesta exitosa con el cliente recién creado
    res.json({ message: "Diseño agregado exitosamente", nuevoDisenio });
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso de creación del cliente
    res.status(500).json({ message: "Error al agregar el Diseño", error });
  }
};

// Actualizar un cliente
const actualizar = async (req, res) => {
  try {
    // Obtener el ID del cliente de los parámetros de la solicitud
    const IdDisenio = req.params.id;
    // Extraer los datos actualizados del cuerpo de la solicitud
    const {
      NombreDisenio,
      Fuente,
      TamanioFuente,
      ColorFuente,
      PosicionFuente,
      TamanioImagen,
      PosicionImagen,
      PrecioDisenio,
      IdImagenDisenio,
      ImagenDisenio,
      IdImagenReferencia,
      ImagenReferencia,
      Estado
    } = req.body;

    // Buscar el cliente por su ID en la base de datos
    const disenio = await disenioModel.findByPk(IdDisenio);
    // Verificar si el cliente existe
    if (!disenio) {
      return res.status(404).json({ message: "Diseño no encontrado" });
    }

    // Actualizar el cliente con los nuevos datos
    await disenio.update({
      NombreDisenio,
      Fuente,
      TamanioFuente,
      ColorFuente,
      PosicionFuente,
      TamanioImagen,
      PosicionImagen,
      PrecioDisenio,
      IdImagenDisenio,
      ImagenDisenio,
      IdImagenReferencia,
      ImagenReferencia,
      Estado
    });

    // Responder con un mensaje de éxito y el cliente actualizado
    res.json({ message: "Diseño actualizado exitosamente", disenio });
  } catch (error) {
    // Manejar cualquier error que ocurra durante la actualización del cliente
    res.status(500).json({ message: "Error al actualizar el diseño ", error:error.message });
  }
};

// Eliminar un cliente
const eliminar = async (req, res) => {
  try {
    // Obtener el ID del cliente de los parámetros de la solicitud
    const IdDisenio = req.params.id;
    // Buscar el cliente por su ID en la base de datos
    const disenio = await disenioModel.findByPk(IdDisenio);
    // Verificar si el cliente existe
    if (!disenio) {
      return res.status(404).json({ message: "Diseño no encontrado" });
    }
    // Eliminar el cliente de la base de datos
    await disenio.destroy();
    // Responder con un mensaje de éxito
    res.json({ message: "Diseño eliminado exitosamente" });
  } catch (error) {
    // Manejar cualquier error que ocurra durante la eliminación del cliente
    res.status(500).json({ message: "Error al eliminar el diseño", error:error.message });
  }
};

// Exportar los controladores para su uso en otras partes de la aplicación
module.exports = { consultar, consultarPorId, agregar, actualizar, eliminar };

// Importar el modelo de Cliente
const clienteModel = require("../models/clienteModel");
const bcryptjs = require('bcryptjs');

// Consultar todos los clientes
const consultar = async (req, res) => {
  try {
    // Buscar todos los clientes en la base de datos
    const clientes = await clienteModel.findAll();
    // Responder con los clientes encontrados
    res.status(200).json(clientes);
  } catch (error) {
    // Manejar cualquier error que ocurra durante la consulta
    console.log("Error al consultar la tabla de clientes: ", error);
    res.status(500).json({ error: "Error al consultar la tabla de clientes" });
  }
};

// Consultar un cliente por su ID
const consultarPorId = async (req, res) => {
  try {
    // Obtener el ID del cliente de los parámetros de la solicitud
    const idCliente = req.params.id;
    // Buscar el cliente por su ID en la base de datos
    const cliente = await clienteModel.findByPk(idCliente);
    // Verificar si el cliente existe
    if (!cliente) {
      return res.status(400).json({ message: "Cliente no encontrado" });
    }
    // Responder con el cliente encontrado
    res.status(200).json(cliente);
  } catch (error) {
    // Manejar cualquier error que ocurra durante la consulta
    console.log("Error al consultar el cliente por ID: ", error);
    res.status(500).json({ error: "Error al consultar el cliente por ID" });
  }
};

// Agregar un nuevo cliente
const agregar = async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud
    const {
      TipoDocumento,
      NroDocumento,
      NombreApellido,
      Telefono,
      Direccion,
      Correo,
      Contrasenia,
      Estado,
    } = req.body;

    // Verificar si ya existe un cliente con el mismo número de documento
    const clienteExistente = await clienteModel.findOne({
      where: { NroDocumento },
    });

    const clienteExistenteCorreo = await clienteModel.findOne({
      where: { Correo },
    });

    if (clienteExistente) {
      // Si ya existe, devuelve un mensaje de error
      return res.status(400).json({
        message: `Ya existe un cliente con el número de documento ${NroDocumento}`,
      });
    }

    if (clienteExistenteCorreo) {
      // Si ya existe, devuelve un mensaje de error
      return res.status(400).json({
        message: `Ya existe un cliente con este correo electronico ${Correo}`,
      });
    }

    let contraseniaHash = await bcryptjs.hash(Contrasenia, 8) 

    // Si no existe, crea un nuevo cliente
    const nuevoCliente = await clienteModel.create({
      TipoDocumento,
      NroDocumento,
      NombreApellido,
      Telefono,
      Direccion,
      Correo,
      Contrasenia: contraseniaHash,
      Estado,
    });

    // Devolver una respuesta exitosa con el cliente recién creado
    res.status(201).json({
      message: "Cliente agregado exitosamente",
      nuevoCliente,
    });
  } catch (error) {
    // Manejo de errores
    console.error("Error al agregar el cliente:", error);
    res.status(500).json({ message: "Error al agregar el cliente",error });
  }
};

// Actualizar un cliente
const actualizar = async (req, res) => {
  try {
    // Obtener el ID del cliente de los parámetros de la solicitud
    const idCliente = req.params.id;
    // Extraer los datos actualizados del cuerpo de la solicitud
    const {
      TipoDocumento,
      NroDocumento,
      NombreApellido,
      Telefono,
      Direccion,
      Correo,
      Contrasenia,
      Estado,
    } = req.body;

    // Buscar el cliente por su ID en la base de datos
    const cliente = await clienteModel.findByPk(idCliente);
    // Verificar si el cliente existe
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Actualizar el cliente con los nuevos datos
    if (Contrasenia) {
      await cliente.update({
        TipoDocumento,
        NroDocumento,
        NombreApellido,
        Telefono,
        Direccion,
        Correo,
        Contrasenia,
        Estado,
      });
    } else {
      await cliente.update({
        TipoDocumento,
        NroDocumento,
        NombreApellido,
        Telefono,
        Direccion,
        Correo,
        Estado,
      });
    }

    // Responder con un mensaje de éxito y el cliente actualizado
    res.json({ message: "Cliente actualizado exitosamente", cliente });
  } catch (error) {
    // Manejar cualquier error que ocurra durante la actualización del cliente
    console.log("Error al actualizar el cliente: ", error);
    res.status(500).json({ message: "Error al actualizar el cliente" });
  }
};

// Eliminar un cliente
const eliminar = async (req, res) => {
  try {
    // Obtener el ID del cliente de los parámetros de la solicitud
    const idCliente = req.params.id;
    // Buscar el cliente por su ID en la base de datos
    const cliente = await clienteModel.findByPk(idCliente);
    // Verificar si el cliente existe
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    // Eliminar el cliente de la base de datos
    await cliente.destroy();
    // Responder con un mensaje de éxito
    res.json({ message: "Cliente eliminado exitosamente" });
  } catch (error) {
    // Manejar cualquier error que ocurra durante la eliminación del cliente
    console.error("Error al eliminar el cliente: ", error);
    res.status(500).json({ message: "Error al eliminar el cliente" });
  }
};

// Exportar los controladores para su uso en otras partes de la aplicación
module.exports = { consultar, consultarPorId, agregar, actualizar, eliminar };

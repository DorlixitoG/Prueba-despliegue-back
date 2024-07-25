const proveedorModel = require("../models/proveedorModel");

// Consultar todos los proveedores
const consultar = async (req, res) => {
  try {
    const proveedores = await proveedorModel.findAll();
    res.status(200).json(proveedores);
  } catch (error) {
    console.log("Error al consultar la tabla de proveedores:", error);
    res.status(500).json({ error: "Error al consultar la tabla de proveedores" });
  }
};

// Consultar un proveedor por su ID
const consultarPorId = async (req, res) => {
  try {
    const idProveedor = req.params.id;
    const proveedor = await proveedorModel.findByPk(idProveedor);
    if (!proveedor) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    res.status(200).json(proveedor);
  } catch (error) {
    console.log("Error al consultar el proveedor por ID:", error);
    res.status(500).json({ error: "Error al consultar el proveedor por ID" });
  }
};

// Agregar un nuevo proveedor
const agregar = async (req, res) => {
  try {
    const {
      TipoDocumento,
      NroDocumento,
      NombreApellido,
      Contacto,
      Telefono,
      Direccion,
      Correo,
      Estado,
    } = req.body;

    // Verificar si ya existe un proveedor con el mismo número de documento o correo
    const proveedorExistente = await proveedorModel.findOne({ where: { NroDocumento } });
    const proveedorExistenteCorreo = await proveedorModel.findOne({ where: { Correo } });

    if (proveedorExistente) {
      return res.status(400).json({ message: `Ya existe un proveedor con el número de documento ${NroDocumento}` });
    }

    if (proveedorExistenteCorreo) {
      return res.status(400).json({ message: `Ya existe un proveedor con el correo electrónico ${Correo}` });
    }

    const nuevoProveedor = await proveedorModel.create({
      TipoDocumento,
      NroDocumento,
      NombreApellido,
      Contacto,
      Telefono,
      Direccion,
      Correo,
      Estado,
    });

    res.status(201).json({ message: "Proveedor agregado exitosamente", nuevoProveedor });
  } catch (error) {
    console.error("Error al agregar el proveedor:", error);
    res.status(500).json({ message: "Error al agregar el proveedor" });
  }
};

// Actualizar un proveedor
const actualizar = async (req, res) => {
  try {
    const {
      TipoDocumento,
      NroDocumento,
      NombreApellido,
      Contacto,
      Telefono,
      Direccion,
      Correo,
      Estado,
    } = req.body;
    const idProveedor = req.params.id;

    const proveedor = await proveedorModel.findByPk(idProveedor);
    if (!proveedor) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    await proveedor.update({
      TipoDocumento,
      NroDocumento,
      NombreApellido,
      Contacto,
      Telefono,
      Direccion,
      Correo,
      Estado,
    });

    res.json({ message: "Proveedor actualizado exitosamente", proveedor });
  } catch (error) {
    console.error("Error al actualizar el proveedor:", error);
    res.status(500).json({ message: "Error al actualizar el proveedor" });
  }
};

// Eliminar un proveedor
const eliminar = async (req, res) => {
  try {
    const idProveedor = req.params.id;
    const proveedor = await proveedorModel.findByPk(idProveedor);
    if (!proveedor) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    await proveedor.destroy();
    res.json({ message: "Proveedor eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el proveedor: ", error);
    res.status(500).json({ message: "Error al eliminar el proveedor" });
  }
};

module.exports = { consultar, consultarPorId, agregar, actualizar, eliminar };

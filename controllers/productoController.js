const productoModel = require("../models/productoModel");
const disenioModel = require("../models/disenioModel");
const insumoModel = require("../models/insumoModel");

// Función para validar la referencia del producto
const validarReferencia = (referencia) => {
  const referenciaRegex = /^[A-Za-z]{3}-\d{3}$/;
  return referenciaRegex.test(referencia);
};

// Función para validar la cantidad del producto
const validarCantidad = (cantidad) => {
  return cantidad && !isNaN(cantidad) && cantidad > 0;
};

// Función para validar el valor de venta del producto
const validarValorVenta = (valorVenta) => {
  return valorVenta && !isNaN(valorVenta) && valorVenta > 0;
};

// Función para consultar todos los productos
const consultar = async (req, res) => {
  try {
    const productos = await productoModel.findAll({

      include: [
        { model: disenioModel, 
          as: "Disenio",
          attributes:["NombreDisenio","ImagenReferencia"]
        
        },        
      ],
    }); 

    res.status(200).json(productos); 
  } catch (error) {
    console.error("Error al consultar los productos:", error);
    res.status(500).json({ message: "Error al consultar los productos" });
  }
};

// Función para consultar un producto por su ID
const consultarPorId = async (req, res) => {
  try {
    const idProducto = req.params.id; 
    const producto = await productoModel.findByPk(idProducto,{
      include: [
        { model: disenioModel, 
          as: "Disenio",
          attributes:["NombreDisenio","ImagenReferencia"]
        },
        { model: insumoModel, 
          as: "Insumo",
          attributes:["IdColor","IdTalla"]
        },        
      ],
    }); 
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(producto); 
  } catch (error) {
    console.error("Error al consultar el producto por el ID:", error);
    res.status(500).json({ message: "Error al consultar el producto por ID" });
  }
};

// Función para agregar un nuevo producto
const agregar = async (req, res) => {
  try {
    const { IdDisenio, IdInsumo, Referencia, Cantidad, ValorVenta, Publicacion, Estado } = req.body;

    // Validar campos vacíos
    if (!IdDisenio || !IdInsumo || !Referencia || !Cantidad || !ValorVenta) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Validar referencia
    if (!validarReferencia(Referencia)) {
      return res.status(400).json({ message: "La referencia debe tener el formato correcto: AAA-000" });
    }

    // Validar la cantidad
    if (!validarCantidad(Cantidad)) {
      return res.status(400).json({ message: "La cantidad es inválida" });
    }

    // Validar el valor de venta
    if (!validarValorVenta(ValorVenta)) {
      return res.status(400).json({ message: "El valor de venta es inválido" });
    }

    // Verificar si ya existe un producto con la misma referencia
    const productoExistente = await productoModel.findOne({ where: { Referencia } });
    if (productoExistente) {
      return res.status(400).json({ message: "Ya existe un producto con la misma referencia" });
    }

    // Verificar si el diseño especificado existe
    const disenioExistente = await disenioModel.findByPk(IdDisenio);
    if (!disenioExistente) {
      return res.status(404).json({ message: "El diseño especificado no existe" });
    }

    // Verificar si el insumo especificado existe
    const insumoExistente = await insumoModel.findByPk(IdInsumo);
    if (!insumoExistente) {
      return res.status(404).json({ message: "El insumo especificado no existe" });
    }

    // Verificar si hay suficiente cantidad de insumo
    if (insumoExistente.Cantidad < Cantidad) {
      return res.status(400).json({ message: "Cantidad de insumo insuficiente" });
    }

    // Crear un nuevo producto en la base de datos
    const nuevoProducto = await productoModel.create({
      IdDisenio,
      IdInsumo,
      Referencia,
      Cantidad,
      ValorVenta,
      Publicacion,
      Estado,
    });

    // Actualizar la cantidad de insumo en la base de datos
    const nuevaCantidadInsumo = insumoExistente.Cantidad - Cantidad;
    await insumoExistente.update({
      Cantidad: nuevaCantidadInsumo,
    });

    res.status(201).json({ message: "Producto agregado exitosamente", nuevoProducto });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ message: "Error al agregar el producto" });
  }
};

// Función para actualizar un producto existente
const actualizar = async (req, res) => {
  try {
    const idProducto = req.params.id; 
    const { IdDisenio, IdInsumo, Referencia, Cantidad, ValorVenta, Publicacion, Estado } = req.body;

    // Validar campos vacíos
    if (!IdDisenio || !IdInsumo || !Referencia || !Cantidad || !ValorVenta) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Validar referencia
    if (!validarReferencia(Referencia)) {
      return res.status(400).json({ message: "La referencia debe tener el formato correcto: AAA-000" });
    }

    // Validar la cantidad
    if (!validarCantidad(Cantidad)) {
      return res.status(400).json({ message: "La cantidad es inválida" });
    }

    // Validar el valor de venta
    if (!validarValorVenta(ValorVenta)) {
      return res.status(400).json({ message: "El valor de venta es inválido" });
    }

    // Verificar si el diseño especificado existe
    const disenioExistente = await disenioModel.findByPk(IdDisenio);
    if (!disenioExistente) {
      return res.status(404).json({ message: "El diseño especificado no existe" });
    }

    // Verificar si el insumo especificado existe
    const insumoExistente = await insumoModel.findByPk(IdInsumo);
    if (!insumoExistente) {
      return res.status(404).json({ message: "El insumo especificado no existe" });
    }



    // Buscar y actualizar el producto con los datos proporcionados
    const productoExistente = await productoModel.findByPk(idProducto);
    if (!productoExistente) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await productoExistente.update({
      IdDisenio,
      IdInsumo,
      Referencia,
      Cantidad,
      ValorVenta,
      Publicacion,
      Estado,
    });

    // Actualizar la cantidad de insumo en la base de datos
    // const nuevaCantidadInsumo = insumoExistente.Cantidad - Cantidad;
    // await insumoExistente.update({
    //   Cantidad: nuevaCantidadInsumo,
    // });

    res.status(200).json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

// Función para eliminar un producto existente
const eliminar = async (req, res) => {
  try {
    const idProducto = req.params.id; 
    const productoExistente = await productoModel.findByPk(idProducto);
    if (!productoExistente) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    await productoExistente.destroy();
    res.status(200).json({ message: "Producto eliminado correctamente" }); 
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};

module.exports = { consultar, consultarPorId, agregar, actualizar, eliminar };

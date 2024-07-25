const { Op } = require("sequelize");
const compraModel = require("../models/compraModel");
const proveedorModel = require("../models/proveedorModel");
const insumoModel = require("../models/insumoModel");
const detalleCompraModel = require("../models/detalleCompraModel");

const obtenerCompras = async (req, res) => {
  try {
    // Obtener todas las compras con detalles y proveedores asociados
    const compras = await compraModel.findAll({
      include: [
        { model: proveedorModel, as: "Proveedor" },
        {
          model: detalleCompraModel,
          as: "DetallesCompras",
          include: [{ model: insumoModel, as: "Insumo" }],
        },
      ],
    });
    console.log("Compras obtenidas:", compras);
    res.status(200).json(compras);
  } catch (error) {
    console.error("Error al obtener las compras:", error.message);
    res
      .status(500)
      .json({ message: "Error al obtener las compras", error: error.message });
  }
};

const obtenerCompraPorId = async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener una compra por su ID con detalles y proveedor asociados
    const compra = await compraModel.findByPk(id, {
      include: [
        { model: proveedorModel, as: "Proveedor" },
        {
          model: detalleCompraModel,
          as: "DetallesCompras",
          include: [{ model: insumoModel, as: "Insumo" }],
        },
      ],
    });
    if (compra) {
      console.log("Compra obtenida:", compra);
      res.status(200).json(compra); // Incluir la fecha y el total en la respuesta
    } else {
      console.log("Compra no encontrada con ID:", id);
      res.status(404).json({ message: "Compra no encontrada" });
    }
  } catch (error) {
    console.error("Error al obtener la compra:", error.message);
    res
      .status(500)
      .json({ message: "Error al obtener la compra", error: error.message });
  }
};

const crearCompra = async (req, res) => {
  try {
    const { IdProveedor, detalles, Fecha, Total } = req.body;

    // Verificar si el proveedor existe
    const proveedorExistente = await proveedorModel.findByPk(IdProveedor);
    if (!proveedorExistente) {
      console.log("Proveedor no encontrado con ID:", IdProveedor);
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    // Crear la compra en la base de datos
    const nuevaCompra = await compraModel.create({
      IdProveedor: IdProveedor,
      Fecha: Fecha || new Date().toISOString().split("T")[0],
      Total:
        Total ||
        detalles.reduce(
          (sum, detalle) => sum + detalle.cantidad * detalle.precio,
          0
        ),
    });

    console.log("Compra creada:", nuevaCompra);

    // Crear los detalles de la compra y actualizar los insumos
    for (const detalle of detalles) {
      // Continuar con la creación del detalle de compra y la actualización del insumo
      const insumoExistente = await insumoModel.findByPk(detalle.IdInsumo);
      if (!insumoExistente) {
        console.log("Insumo no encontrado con ID:", detalle.IdInsumo);
        return res
          .status(404)
          .json({ message: `Insumo con ID ${detalle.IdInsumo} no encontrado` });
      }

      // Obtener el precio actual del insumo
      let precioActual = insumoExistente.ValorCompra || 0;

      // Si el nuevo precio es mayor que el precio actual, actualizarlo
      if (detalle.precio > precioActual) {
        precioActual = detalle.precio;
      }

      // Calcular el subtotal del detalle de compra
      const subTotal = parseFloat(detalle.cantidad) * parseFloat(precioActual);

      // Crear el detalle de compra
      const nuevoDetalle = await detalleCompraModel.create({
        IdCompra: nuevaCompra.IdCompra,
        IdInsumo: detalle.IdInsumo,
        Cantidad: detalle.cantidad,
        Precio: precioActual,
        SubTotal: subTotal,
      });

      console.log("Detalle de compra creado:", nuevoDetalle);

      // Actualizar la cantidad de insumo en la tabla insumoModel
      const nuevaCantidad =
        parseFloat(insumoExistente.Cantidad) + parseFloat(detalle.cantidad);
      await insumoExistente.update({
        Cantidad: nuevaCantidad,
        ValorCompra: precioActual, // Actualizar el precio del insumo siempre
      });

      console.log("Insumo actualizado:", insumoExistente);
    }

    res.status(201).json({ message: "Compra creada exitosamente" });
  } catch (error) {
    console.error("Error al crear la compra:", error.message);
    res
      .status(500)
      .json({ message: "Error al crear la compra", error: error.message });
  }
};

const inhabilitarCompra = async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener todos los detalles de la compra
    const detallesCompra = await detalleCompraModel.findAll({
      where: { IdCompra: id },
    });

    // Recorrer cada detalle de la compra para actualizar los insumos
    for (const detalle of detallesCompra) {
      const insumoExistente = await insumoModel.findByPk(detalle.IdInsumo);
      if (insumoExistente) {
        // Restar la cantidad de insumo utilizada en esta compra
        const nuevaCantidad =
          parseFloat(insumoExistente.Cantidad) - parseFloat(detalle.Cantidad);

        // Validar que la cantidad no sea negativa
        if (nuevaCantidad < 0) {
          console.log(
            "No se puede inhabilitar la compra, cantidad insuficiente de insumo:",
            insumoExistente
          );
          return res
            .status(400)
            .json({
              message: `No se puede inhabilitar la compra, cantidad insuficiente de insumo`,
            });
        }

        // Actualizar la cantidad de insumo en la tabla insumoModel
        await insumoExistente.update({
          Cantidad: nuevaCantidad,
        });

        console.log(
          "Insumo actualizado al inhabilitar compra:",
          insumoExistente
        );
      }
    }

    // Cambiar el estado de la compra a "Cancelado"
    await compraModel.update(
      { Estado: "Cancelado" },
      { where: { IdCompra: id } }
    );

    console.log("Compra inhabilitada correctamente");
    res.status(200).json({ message: "Compra inhabilitada correctamente" });
  } catch (error) {
    console.error("Error al inhabilitar la compra:", error.message);
    res.status(500).json({
      message: "Error al inhabilitar la compra",
      error: error.message,
    });
  }
};

module.exports = {
  obtenerCompras,
  obtenerCompraPorId,
  crearCompra,
  inhabilitarCompra,
};

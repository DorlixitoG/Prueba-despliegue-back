// Importar el modelo de Pedido y Cliente
const pedidoModel = require("../models/pedidoModel");
const Cliente = require("../models/clienteModel");
const { json } = require("body-parser");
const clienteModel = require("../models/clienteModel");
const detallePedidoProductoModel = require("../models/detallePedidoModel");
const productoModel = require("../models/productoModel");

// Consultar todos los pedidos
const obtenerPedidos = async (req, res) => {
  try {
    
    const pedidos = await pedidoModel.findAll({
      include: [
        { model: clienteModel, as: "Cliente" },
        {
          model: detallePedidoProductoModel,
          as: "DetallesPedidosProductos",
          include: [{ model: productoModel, as: "Producto" }],
        },
      ],
    });

    console.log("Pedidos obtenidos:", pedidos);
    res.status(200).json(pedidos);


  } catch (error) {
    // Manejar cualquier error que ocurra durante la consulta
    console.error("Error al consultar los pedidos:", error);
    res.status(500).json({ message: "Error al consultar los pedidos",  error: error.message });
  }
};

// Consultar un pedido por su ID
const consultarPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await pedidoModel.findByPk(id,{
      include: [
        { model: clienteModel, as: "Cliente" },
        {
          model: detallePedidoProductoModel,
          as: "DetallesPedidosProductos",
          include: [{ model: productoModel, as: "Producto" }],
        },
      ],
    });

    if (pedido) {
      console.log("Pedido obtenido:", pedido);
      res.status(200).json(pedido); // Incluir la fecha y el total en la respuesta
    } else {
      console.log("Pedido no encontrado con ID:", id);
      res.status(404).json({ message: "Pedido no encontrado" });
    }

  } catch (error) {
    // Manejar cualquier error que ocurra durante la consulta
    console.error("Error al consultar el pedido por ID:", error);
    res.status(500).json({ message: "Error al consultar el pedido por ID", error: error.message  });
  }
};

// Agregar un nuevo pedido
const crearPedido = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { IdCliente, Detalles,Fecha, Total, IdEstadoPedido } = req.body;

    // Verificar si el cliente con el IdCliente proporcionado existe
    const clienteExistente = await Cliente.findByPk(IdCliente);
    if (!clienteExistente) {
      console.log("cliente no encontrado con ID:", IdCliente);
      return res.status(404).json({
        message: "El cliente con el IdCliente proporcionado no existe",
      });
    }
    console.log(IdCliente,
      Detalles,
      Fecha,
      Total,
      IdEstadoPedido);

    // Crear un nuevo pedido en la base de datos
    const nuevoPedido = await pedidoModel.create({
      IdCliente: IdCliente,
      Fecha: Fecha || new Date().toISOString().split("T")[0],
      Total: Total|| Detalles.reduce(
        (sum, detalle) => sum + detalle.cantidad * detalle.precio,
        0
      ),
      IdEstadoPedido:IdEstadoPedido,
    });

    // Responder con el nuevo pedido creado
    res
      .status(201)
      .json({ message: "Pedido agregado exitosamente", nuevoPedido });

    // Crear los detalles de la compra y actualizar los insumos
    for (const detalle of Detalles) {
      // Continuar con la creación del detalle de compra y la actualización del insumo
      const productoExistente = await productoModel.findByPk(detalle.IdProducto);
      if (!productoExistente) {
        console.log("producto no encontrado con ID:", detalle.IdProducto);
        return res
          .status(404)
          .json({ message: `producto con ID ${detalle.IdProducto} no encontrado` });
      }

      // Obtener el precio actual del insumo
      let precioActual = productoExistente.ValorVenta || 0;

      // Si el nuevo precio es mayor que el precio actual, actualizarlo
      // if (detalle.precio > precioActual) {
      //   precioActual = detalle.precio;
      // }

      // Calcular el subtotal del detalle de pedido
      const subTotal = parseFloat(detalle.cantidad) * parseFloat(precioActual);

      // Crear el detalle de pedido
      const nuevoDetalle = await detallePedidoProductoModel.create({
        IdPedido: nuevoPedido.IdPedido,
        IdProducto: detalle.IdProducto,
        Cantidad: detalle.cantidad,
        Precio: precioActual,
        SubTotal: subTotal,
      });

      console.log("Detalle de pedido creado:", nuevoDetalle);

      // Actualizar la cantidad de insumo en la tabla insumoModel
      const nuevaCantidad =
        parseFloat(productoExistente.Cantidad) - parseFloat(detalle.cantidad);
      await productoExistente.update({
        Cantidad: nuevaCantidad,
        
        // Actualizar el precio del insumo siempre
        // ValorCompra: precioActual,
      });

      console.log("producto actualizado:", productoExistente);
    }

    // res.status(200).json({ message: "Pedido creado exitosamente" });

      
  } catch (error) {
    // Manejar cualquier error que ocurra durante la creación del pedido
    console.error("Error al agregar el pedido:", error);
    // res.status(500).json({ message: "Error al agregar el pedido",error:error.message });
  }
};



const cambiarEstadoPedido = async (req, res) => {
  const { id } = req.params;
  const { Estado } = req.body;
  try {

    console.log(id,Estado);


    // Obtener todos los detalles de la compra
    const detallesPedidos = await detallePedidoProductoModel.findAll({
      where: { IdPedido: id },
    });

    // Recorrer cada detalle de la compra para actualizar los insumos
    for (const detalle of detallesPedidos) {
      const ProductoExistente = await productoModel.findByPk(detalle.IdProducto);
      if (ProductoExistente) {
        // Restar la cantidad de insumo utilizada en esta compra
        const nuevaCantidad =
          parseFloat(ProductoExistente.Cantidad) + parseFloat(detalle.Cantidad);

        // Validar que la cantidad no sea negativa
        if (nuevaCantidad < 0) {
          console.log(
            "No se puede inhabilitar el pedido, cantidad insuficiente de producto:",
            ProductoExistente
          );
          return res
            .status(400)
            .json({
              message: `No se puede inhabilitar la compra, cantidad insuficiente de insumo`,
            });
        }

        // Actualizar la cantidad de insumo en la tabla insumoModel
        await ProductoExistente.update({
          Cantidad: nuevaCantidad,
        });

        console.log(
          "Producto actualizado al inhabilitar compra:",
          ProductoExistente
        );
      }
    }

    // Cambiar el estado de la compra a "Cancelado"
    await pedidoModel.update(
      { IdEstadoPedido: Estado },
      { where: { IdPedido: id } }
    );

    console.log("Pedido inhabilitado correctamente");
    res.status(200).json({ message: "Pedido inhabilitado correctamente" });
  } catch (error) {
    console.error("Error al inhabilitar el Pedido:", error.message);
    res.status(500).json({
      message: "Error al inhabilitar el Pedido",
      error: error.message,
    });
  }
};






// Exportar los controladores para su uso en otras partes de la aplicación
module.exports = { obtenerPedidos, consultarPorId, crearPedido,  cambiarEstadoPedido };

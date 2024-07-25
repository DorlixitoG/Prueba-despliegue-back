const EstadosPedidosModel = require("../models/estadosPedidosModel");

const consultarEstadosPedidos = async (req, res) => {
  try {
    const estadosPedidos= await EstadosPedidosModel.findAll();
    res.status(200).json(estadosPedidos);
  } catch (error) {
    console.log("Error al consultar la tabla de estados pedidos: ", error);
    
    res.status(500).json({ error: "Error al consultar la tabla de estados pedidos" });
  }
};

module.exports = { consultarEstadosPedidos };

// Importar Sequelize y el objeto de conexión a la base de datos
const Sequelize = require("sequelize");
const db = require("../db");
const clienteModel = require("./clienteModel");
const EstadosPedidosModel = require("./estadosPedidosModel");

// Definir el modelo de datos para los pedidos
const pedidoModel = db.define(
  "Pedidos", // Nombre del modelo en la base de datos
  {
    IdPedido: {
      type: Sequelize.INTEGER, // Tipo de dato: INTEGER
      primaryKey: true, // Campo clave primaria
      autoIncrement: true, // Se autoincrementa automáticamente
      allowNull: false,
    },
    IdCliente: {
      type: Sequelize.INTEGER, // Tipo de dato: INTEGER
      allowNull: false,
      references:{
        model:clienteModel,
        key:"IdCliente"
      },
      validate: {
        isInt: {
          msg: "El ID del cliente debe ser un número entero.",
        },
      },  
    },
    Fecha: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: "La fecha debe tener un formato válido. (DD/MM/AAAA)",
        },
      },
    },
    Total: {
      type: Sequelize.DOUBLE,
      validate: {
        isDecimal: {
          args: true,
          msg: "El valor debe ser un número decimal.",
        },
        min: {
          args: [0],
          msg: "El valor mínimo permitido es 0.",
        },
        max: {
          args: [1000000],
          msg: "El valor máximo permitido es 1 millón.",
        },
      },
    },
    IdEstadoPedido: {
      type: Sequelize.INTEGER, // Tipo de dato: STRING
      allowNull: false,
      references:{
        model: EstadosPedidosModel,
        key: "IdEstadoPedido",
      },
    },
  },
  {
    tableName: "Pedidos", // Nombre de la tabla en la base de datos
    timestamps: false, // No se incluirán campos createdAt y updatedAt
  }
);

clienteModel.hasMany(pedidoModel, {
  foreignKey: "IdCliente",
  sourceKey: "IdCliente",
  as: "pedidos", // Alias para las compras del proveedor
});

pedidoModel.belongsTo(clienteModel, {
  foreignKey: "IdCliente",
  targetKey: "IdCliente",
  as: "Cliente", // Alias para el proveedor en la compra
});




EstadosPedidosModel.hasMany(pedidoModel, {
  foreignKey: "IdEstadoPedido",
  sourceKey: "IdEstadoPedido",
  as: "pedidos", // Alias para las compras del proveedor
});

pedidoModel.belongsTo(EstadosPedidosModel, {
  foreignKey: "IdEstadoPedido",
  targetKey: "IdEstadoPedido",
  as: "EstadoPedido", // Alias para el proveedor en la compra
});



// Exportar el modelo de pedido para su uso en otras partes de la aplicación
module.exports = pedidoModel;

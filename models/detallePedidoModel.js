const Sequelize = require("sequelize");
const db = require("../db");

const pedidoModel = require("./pedidoModel");
const productoModel = require("./productoModel");

const detallePedidoProductoModel = db.define(
  "DetallesPedidosProductos",
  {
    IdDetallePedidoProducto: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    IdPedido: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: pedidoModel,
        key: "IdPedido",
      },
      validate: {
        isInt: {
          msg: "El ID del pedido debe ser un número entero.",
        },
      },
    },
    IdProducto: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: productoModel,
        key: "IdProducto",
      },
      validate: {
        isInt: {
          msg: "El ID del producto debe ser un número entero.",
        },
      },
    },
    Cantidad: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La cantidad es requerida.",
        },
        isInt: {
          msg: "La cantidad debe ser un número entero.",
        },
        min: {
          args: [1],
          msg: "La cantidad mínima permitida es 1.",
        },
      },
    },
    Precio: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El precio es requerido.",
        },
        isDecimal: {
          args: true,
          msg: "El precio debe ser un número decimal.",
        },
        min: {
          args: [0],
          msg: "El precio mínimo permitido es 0.",
        },
        max: {
          args: [1000000],
          msg: "El precio máximo permitido es 1 millón.",
        },
      },
    },
    SubTotal: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El sub total es requerido.",
        },
        isDecimal: {
          args: true,
          msg: "El sub total debe ser un número decimal.",
        },
      },
    },
  },
  {
    tableName: "DetallesPedidosProductos",
    timestamps: false,
  }
);

detallePedidoProductoModel.belongsTo(productoModel, {
  foreignKey: "IdProducto",
  as: "Producto",
});
detallePedidoProductoModel.belongsTo(pedidoModel, {
  foreignKey: "IdPedido",
  as: "Pedido",
});
pedidoModel.hasMany(detallePedidoProductoModel, {
  foreignKey: "IdPedido",
  as: "DetallesPedidosProductos",
});

module.exports = detallePedidoProductoModel;

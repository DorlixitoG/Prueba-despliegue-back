const Sequelize = require("sequelize");
const db = require("../db");

const EstadosPedidosModel = db.define(
  "EstadosPedidos",
  {
    IdEstadoPedido: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    NombreEstado: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El nombre del estado es requerido.",
        },
        isIn: {
          args: [["Pendiente", "En proceso", "Completado", "Cancelado"]],
          msg: "Estado no válido",
        },
        notNull: {
          msg: "El estado es requerido",
        },
      },
    },
  },
  {
    tableName: "EstadosPedidos",
    timestamps: false,
  }
);

module.exports = EstadosPedidosModel;

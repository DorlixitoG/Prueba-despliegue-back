const Sequelize = require("sequelize");
const db = require("../db");
const insumoModel = require("./insumoModel");
const compraModel = require("./compraModel");

const detalleCompraModel = db.define(
  "DetallesCompras",
  {
    IdDetalleCompra: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    IdInsumo: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: insumoModel,
        key: "IdInsumo",
      },
      validate: {
        isInt: {
          msg: "El ID del insumo debe ser un número entero.",
        },
      },
    },
    IdCompra: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: compraModel,
        key: "IdCompra",
      },
      validate: {
        isInt: {
          msg: "El ID de la compra debe ser un número entero.",
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
          msg: "La cantidad mínima permitida es 1.", // Esto asegura que no se acepten números negativos ni cero.
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
          msg: "El precio mínimo permitido es 0.", // Esto asegura que no se acepten números negativos.
        },
        max: {
          args: [10000000], // Modificado para permitir hasta 10 millones
          msg: "El precio máximo permitido es 10 millones.", // Mensaje de validación
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
    tableName: "DetallesCompras",
    timestamps: false,
  }
);

detalleCompraModel.belongsTo(insumoModel, {
  foreignKey: "IdInsumo",
  as: "Insumo",
});
detalleCompraModel.belongsTo(compraModel, {
  foreignKey: "IdCompra",
  as: "Compra",
});
compraModel.hasMany(detalleCompraModel, {
  foreignKey: "IdCompra",
  as: "DetallesCompras",
});

module.exports = detalleCompraModel;

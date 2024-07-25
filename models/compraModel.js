const Sequelize = require("sequelize");
const db = require("../db");
const proveedorModel = require("./proveedorModel");

const compraModel = db.define(
  "Compras",
  {
    IdCompra: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    IdProveedor: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: proveedorModel,
        key: "IdProveedor",
      },
      validate: {
        isInt: {
          msg: "El ID del proveedor debe ser un número entero.",
        },
      },
    },
    Fecha: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: "La fecha debe tener un formato válido.",
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
          args: [10000000], // Modificado para permitir hasta 10 millones
          msg: "El valor máximo permitido es 10 millones.", // Mensaje de validación
        },
      },
    },
    Estado: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Activo",
      validate: {
        isIn: {
          args: [["Activo", "Cancelado"]],
          msg: "Estado no válido",
        },
        notNull: {
          msg: "El estado es requerido",
        },
        is: {
          args: /^[a-zA-Z\s]*$/,
          msg: "El estado no puede contener caracteres especiales",
        },
      },
    },
  },
  {
    tableName: "Compras",
    timestamps: false,
  }
);

proveedorModel.hasMany(compraModel, {
  foreignKey: "IdProveedor",
  sourceKey: "IdProveedor",
  as: "compras", // Alias para las compras del proveedor
});

compraModel.belongsTo(proveedorModel, {
  foreignKey: "IdProveedor",
  targetKey: "IdProveedor",
  as: "Proveedor", // Alias para el proveedor en la compra
});

compraModel.beforeUpdate(async (compra, options) => {
  if (compra.Estado === "Cancelado") {
    throw new Error("No se puede modificar una compra cancelada.");
  }
});

module.exports = compraModel;

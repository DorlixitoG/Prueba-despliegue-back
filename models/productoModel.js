const sequelize = require("sequelize"); // Importa la biblioteca Sequelize
const db = require("../db");
const disenioModel = require("./disenioModel");
const insumoModel = require("./insumoModel");

const productoModel = db.define(
  "Productos",
  {
    IdProducto: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    IdDisenio: {
      type: sequelize.INTEGER,
      allowNull: false, // No se permite un valor nulo para IdDisenio
      references: {
        model: disenioModel,
        key: "IdDisenio",
      },
      validate: {
        isInt: {
          msg: "El ID del diseño debe ser un número entero.",
        },
      },
    },
    IdInsumo: {
      type: sequelize.INTEGER,
      allowNull: false, // No se permite un valor nulo para IdInsumo
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
    Referencia: {
      type: sequelize.STRING,
      allowNull: false, // No se permite un valor nulo para Referencia
    },
    Cantidad: {
      type: sequelize.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "La cantidad debe ser un número entero.",
        },
        min: {
          args: [0], // La cantidad mínima permitida
          msg: "La cantidad debe ser mayor que cero.",
        },
      },
    },
    ValorVenta: {
      type: sequelize.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "El valor de venta debe ser un número entero.",
        },
        min: {
          args: [0], // El valor de venta mínimo permitido
          msg: "El valor de venta no puede ser negativo.",
        },
      },
    },
    Publicacion: {
      type: sequelize.STRING, // Tipo de dato: STRING
      allowNull: false, // No se permiten valores nulos
      defaultValue: "Activo", // Valor predeterminado: "Activo"
      validate: {
        isIn: {
          args: [["Activo", "Inactivo"]],
          msg: "Estado no válido",
        },
        notNull: {
          msg: "El estado es requerido",
        },
        is: {
          args: /^[a-zA-Z\s]*$/, // No se permiten caracteres especiales
          msg: "El estado no puede contener caracteres especiales",
        },
      },
    },
    Estado: {
      type: sequelize.STRING, // Tipo de dato: STRING
      allowNull: false, // No se permiten valores nulos
      defaultValue: "Activo", // Valor predeterminado: "Activo"
      validate: {
        isIn: {
          args: [["Activo", "Inactivo"]],
          msg: "Estado no válido",
        },
        notNull: {
          msg: "El estado es requerido",
        },
        is: {
          args: /^[a-zA-Z\s]*$/, // No se permiten caracteres especiales
          msg: "El estado no puede contener caracteres especiales",
        },
      },
    },
  },
  {
    tableName: "Productos",
    timestamps: false,
  }
);


disenioModel.hasMany(productoModel, {
  foreignKey: "IdDisenio",
  sourceKey: "IdDisenio",
  as: "Producto", // Alias para las compras del proveedor
});

productoModel.belongsTo(disenioModel, {
  foreignKey: "IdDisenio",
  targetKey: "IdDisenio",
  as: "Disenio", // Alias para el proveedor en la compra
});


// insumoModel.hasMany(productoModel, {
//   foreignKey: "IdInsumo",
//   sourceKey: "IdInsumo",
//   as: "Producto", // Alias para las compras del proveedor
// });

productoModel.belongsTo(insumoModel, {
  foreignKey: "IdInsumo",
  targetKey: "IdInsumo",
  as: "Insumo", // Alias para el proveedor en la compra
});


module.exports = productoModel;

// Importar Sequelize y el objeto de conexión a la base de datos
const sequelize = require("sequelize");
const db = require("../db");
const colorModel = require("./colorModel");
const tallaModel = require("./tallaModel");

// Definir el modelo de datos para los pedidos
const insumoModel = db.define(
  "Insumos", // Nombre del modelo en la base de datos
  {
    IdInsumo: {
      type: sequelize.INTEGER, // Tipo de dato: INTEGER
      primaryKey: true, // Campo clave primaria
      autoIncrement: true, // Se autoincrementa automáticamente
    },
    IdColor: {
      type: sequelize.INTEGER, // Tipo de dato: INTEGER
    },
    IdTalla: {
      type: sequelize.INTEGER, // Tipo de dato: INTEGER
    },
    Referencia: {
      type: sequelize.STRING, // Tipo de dato: STRING
      validate: {
        notEmpty: true, // No permite que el campo esté vacío
        is: /^[a-zA-Z0-9\s\-_]+$/, // Permite letras, números, espacios, guiones y guiones bajos
      },
    },
    Cantidad: {
      type: sequelize.INTEGER, // Tipo de dato: INTEGER
      validate: {
        notEmpty: true, // No permite que el campo esté vacío
        isNumeric: true, // Verifica que sea un número
        min: {
          args: [0], // La cantidad debe ser mayor o igual que cero
          msg: "La cantidad debe ser un número positivo",
        },
      },
    },
    ValorCompra: {
      type: sequelize.FLOAT, // Tipo de dato: FLOAT para permitir decimales
      validate: {
        notEmpty: true, // No permite que el campo esté vacío
        isFloat: {
          // Verifica que sea un número o decimal
          msg: "El valor de compra debe ser un número positivo o decimal",
        },
        min: {
          args: [0], // El valor de compra debe ser mayor o igual que cero
          msg: "El valor de compra debe ser un número positivo o decimal",
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
          args: /^[a-zA-Z\s]*$/, // No se permiten caracteres especiales en el estado
          msg: "El estado no puede contener caracteres especiales",
        },
      },
    },
  },
  {
    tableName: "Insumos", // Nombre de la tabla en la base de datos
    timestamps: false, // No se incluirán campos createdAt y updatedAt
  }
);

insumoModel.belongsTo(colorModel, { foreignKey: "IdColor" }); // Relación muchos a uno: Un Insumo pertenece a un Color
insumoModel.belongsTo(tallaModel, { foreignKey: "IdTalla" });

// Exportar el modelo de pedido para su uso en otras partes de la aplicación
module.exports = insumoModel;

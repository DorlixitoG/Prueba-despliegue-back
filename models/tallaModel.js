// Importación de Sequelize y la configuración de la base de datos
const sequelize = require("sequelize");
const db = require("../db");

// Definición del modelo "Tallas"
const tallaModel = db.define(
  "Tallas", // Nombre del modelo, debe coincidir con el nombre de la tabla en la base de datos
  {
    // Definición de los campos de la tabla "Tallas"
    IdTalla: {
      type: sequelize.INTEGER, // Tipo de dato: INTEGER
      primaryKey: true, // Campo clave primaria
      autoIncrement: true, // Se autoincrementa automáticamente
    },
    Talla: {
      type: sequelize.STRING, // Tipo de dato: STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [["XXXS","XXS","XS","S", "M", "L","XL","XXL","XXXL","XXXXL"]],
          msg: "Las tallas deben ser : \n (XXXS, XXS, XS ,S, M, L, XL, XXL, XXXL, XXXXL)"
        }
        
      }
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
    tableName: "Tallas", // Nombre de la tabla en la base de datos
    timestamps: false, // Evitar que Sequelize añada createdAt y updatedAt
  }
);

// Exportación del modelo "Tallas" para su uso en otras partes de la aplicación
module.exports = tallaModel;

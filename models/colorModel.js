const sequelize = require("sequelize");
const db = require("../db");

const colorModel = db.define(
  "Colores",
  {
    IdColor: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Color: {
      type: sequelize.STRING,
      allowNull: false,
      validate: {
        isText(value) {
          if (!/^[a-zA-Z\s]+$/.test(value)) {
            throw new Error("El campo Color solo puede contener texto");
          }
        },
        maxLength(value) {
          if (value.length > 20) {
            throw new Error("El campo Color no puede tener más de 20 caracteres");
          }
        },
      },
    },
    Referencia: {
      type: sequelize.STRING,
      allowNull: false,
      validate: {
        isHexadecimal(value) {
          if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
            throw new Error("El campo Referencia debe ser un formato hexadecimal");
          }
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
    tableName: "Colores",
    timestamps: false,
  }
);

module.exports = colorModel;

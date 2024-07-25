// Importación de Sequelize y la configuración de la base de datos
const sequelize = require("sequelize");
const db = require("../db");

// Definición del modelo "Usuarios"
const rolModel = db.define(
  "Roles", // Nombre del modelo, debe coincidir con el nombre de la tabla en la base de datos
  {
    // Definición de los campos de la tabla "Usuarios"
    IdRol: {
      type: sequelize.INTEGER, // Tipo de dato: INTEGER
      primaryKey: true, // Campo clave primaria
      autoIncrement: true, // Se autoincrementa automáticamente
      allowNull: false,
    },
    NombreRol: {
      type: sequelize.STRING, // Tipo de dato: STRING
      allowNull: false, // No se permiten valores nulos
      unique: {
        args: true,
        msg: "El nombre del rol debe ser único",
      },
      validate: {
        len: {
          args: [3, 60],
          msg: "El nombre del rol debe tener entre 3 y 60 caracteres",
        },
        notNull: {
          msg: "El nombre del rol es requerido",
        },
        is: {
          args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, // Permitir letras con tildes, espacios y la letra ñ
          msg: "El nombre del rol solo puede contener letras con tildes, la letra ñ y espacios",
        },
        noSpacesAtEdges(value) {
          if (value.trim().length !== value.length) {
            throw new Error(
              "El nombre del rol no debe tener espacios al principio ni al final"
            );
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
    tableName: "Roles", // Nombre de la tabla en la base de datos
    timestamps: false, // Evitar que Sequelize añada createdAt y updatedAt
  }
);

// Exportación del modelo "Usuarios" para su uso en otras partes de la aplicación
module.exports = rolModel;

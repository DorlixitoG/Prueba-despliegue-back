// Importación de Sequelize y la configuración de la base de datos
const Sequelize = require("sequelize");
const db = require("../db");

// Definición del modelo "Permisos"
const permisoModel = db.define(
  "Permisos",
  {
    IdPermiso: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Permiso: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El permiso es requerido",
        },
        is: {
          args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s,]*$/,
          msg: "El permiso solo puede contener letras con tildes, la letra ñ, espacios y comas",
        },
      },
    },
  },
  {
    tableName: "Permisos",
    timestamps: false,
  }
);

module.exports = permisoModel;

const Sequelize = require("sequelize");
const db = require("../db");
const rolModel = require("./rolModel"); // Importa el modelo de Roles

const usuarioModel = db.define(
  "Usuarios",
  {
    IdUsuario: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false, 
    },
    IdRol: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Roles",
        key: "IdRol",
      },
      validate: {
        notNull: {
          msg: "El IdRol es requerido",
        },
      },
    },
    Usuario: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 60],
          msg: "El usuario debe tener entre 3 y 60 caracteres",
        },
        notNull: {
          msg: "El nombre y apellido es requerido",
        },
        is: {
          args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/,
          msg: "El nombre y apellido solo puede contener letras con tildes, la letra ñ y espacios",
        },
      },
    },
    Correo: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: {
          args: [10, 50],
          msg: "El correo debe tener entre 10 y 50 caracteres",
        },
        isEmail: {
          msg: "Correo electrónico no válido",
        },
        noSpaces(value) {
          if (/\s/.test(value)) {
            throw new Error("El correo electrónico no puede contener espacios");
          }
        },
      },
    },
    Contrasenia: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 15],
          msg: "La contraseña debe tener entre 8 y 15 caracteres",
        },
        notNull: {
          msg: "La contraseña es requerida",
        },
      },
    },
    Estado: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Activo",
      validate: {
        isIn: {
          args: [["Activo", "Inactivo"]],
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
    tableName: "Usuarios",
    timestamps: false,
  }
);

// Definición de la relación con Roles
usuarioModel.belongsTo(rolModel, { foreignKey: "IdRol" });
rolModel.hasMany(usuarioModel, { foreignKey: "IdRol" });

module.exports = usuarioModel;

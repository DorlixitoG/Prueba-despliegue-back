// Importación de Sequelize y la configuración de la base de datos
const sequelize = require("sequelize");
const db = require("../db");

// Definición del modelo "Proveedores"
const proveedorModel = db.define(
  "Proveedores", // Nombre del modelo, debe coincidir con el nombre de la tabla en la base de datos
  {
    IdProveedor: {
      type: sequelize.INTEGER, // Tipo de dato: INTEGER
      primaryKey: true, // Campo clave primaria
      autoIncrement: true, // Se autoincrementa automáticamente
      allowNull: false,
    },
    TipoDocumento: {
      type: sequelize.STRING, // Tipo de dato: STRING
      validate: {
        isIn: {
          args: [["CC", "CE", "NIT"]],
          msg: "Tipo de documento no válido",
        },
      },
    },
    NroDocumento: {
      type: sequelize.STRING, // Tipo de dato: STRING
      unique: true, // Campo único
      allowNull: false, // No se permiten valores nulos
      validate: {
        isInt: {
          msg: "El número de documento debe contener solo números",
        },
        isNotStartingWithZero(value) {
          if (value.startsWith("0")) {
            throw new Error("El número de documento no puede comenzar con 0");
          }
        },
        isNotAllZeros(value) {
          if (/^0+$/.test(value)) {
            throw new Error("El número de documento no puede ser todo ceros");
          }
        },
        isInRange(value) {
          const stringValue = value.toString();
          if (stringValue.length < 6 || stringValue.length > 10) {
            throw new Error(
              "El número de documento debe tener entre 6 y 10 dígitos"
            );
          }
        },
        notNull: {
          msg: "El número de documento es requerido",
        },
      },
    },
    NombreApellido: {
      type: sequelize.STRING, // Tipo de dato: STRING
      allowNull: false, // No se permiten valores nulos
      validate: {
        len: {
          args: [2, 60],
          msg: "El nombre y apellido debe tener entre 2 y 60 caracteres",
        },
        notNull: {
          msg: "El nombre y apellido es requerido",
        },
        is: {
          args: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/, // Permitir letras con tildes, números, espacios y la letra ñ
          msg: "El nombre y apellido solo puede contener letras con tildes, números, la letra ñ y espacios",
        },
      },
    },
    Contacto: {
      type: sequelize.STRING, // Tipo de dato: STRING
      allowNull: false, // No se permiten valores nulos
      validate: {
        len: {
          args: [2, 60],
          msg: "El contacto debe tener entre 2 y 60 caracteres",
        },
        notNull: {
          msg: "El contacto es requerido",
        },
        is: {
          args: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/, // Permitir letras con tildes, números, espacios y la letra ñ
          msg: "El contacto solo puede contener letras con tildes, números, la letra ñ y espacios",
        },
      },
    },
    Telefono: {
      type: sequelize.STRING, // Tipo de dato: STRING
      allowNull: false, // No se permiten valores nulos
      validate: {
        isNumeric: {
          msg: "El número de teléfono debe contener solo números",
        },
        isNotStartingWithZero(value) {
          if (value.startsWith("0")) {
            throw new Error("El número de teléfono no puede comenzar con 0");
          }
        },
        isNotAllZeros(value) {
          if (/^0+$/.test(value)) {
            throw new Error("El número de teléfono no puede ser todo ceros");
          }
        },
        isExactlyTen(value) {
          if (!/^\d{10}$/.test(value)) {
            throw new Error(
              "El número de teléfono debe tener exactamente 10 dígitos"
            );
          }
        },
        notNull: {
          msg: "El número de teléfono es requerido",
        },
      },
    },
    Direccion: {
      type: sequelize.STRING, // Tipo de dato: STRING
      allowNull: false, // No se permiten valores nulos
      validate: {
        len: {
          args: [10, 50],
          msg: "La dirección debe tener entre 10 y 50 caracteres",
        },
        notNull: {
          msg: "La dirección es requerida",
        },
        is: {
          args: /^[a-zA-Z0-9\s#-]*$/, // Permitir letras, números, espacios, "#" y "-"
          msg: "La dirección solo puede contener letras, números, espacios, '#' y '-'",
        },
      },
    },
    Correo: {
      type: sequelize.STRING, // Tipo de dato: STRING
      unique: true, // Campo único
      allowNull: false, // No se permiten valores nulos
      validate: {
        len: {
          args: [10, 50],
          msg: "El correo debe tener entre 10 y 50 caracteres",
        },
        isEmail: {
          msg: "Correo electrónico no válido",
        },
        notNull: {
          msg: "El correo electrónico es requerido",
        },
        noSpaces(value) {
          if (/\s/.test(value)) {
            throw new Error("El correo electrónico no puede contener espacios");
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
    tableName: "Proveedores", // Nombre de la tabla en la base de datos
    timestamps: false, // Evitar que Sequelize añada createdAt y updatedAt
  }
);

// Exportación del modelo "Proveedores" para su uso en otras partes de la aplicación
module.exports = proveedorModel;

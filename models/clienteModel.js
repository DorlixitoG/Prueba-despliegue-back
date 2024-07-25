const sequelize = require("sequelize");
const db = require("../db");

// Definición del modelo de clientes
const clienteModel = db.define(
  "Clientes", // Nombre del modelo en la base de datos
  {
    IdCliente: {
      type: sequelize.INTEGER, // Tipo de dato: INTEGER
      primaryKey: true, // Campo clave primaria
      autoIncrement: true, // Se autoincrementa automáticamente
      allowNull: false, // No se permiten valores nulos
    },
    TipoDocumento: {
      type: sequelize.STRING, // Tipo de dato: STRING
      validate: {
        isIn: {
          args: [["CC", "CE"]],
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
          args: [10, 60],
          msg: "El nombre y apellido debe tener entre 10 y 60 caracteres",
        },
        notNull: {
          msg: "El nombre y apellido es requerido",
        },
        is: {
          args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, // Permitir letras con tildes, espacios y la letra ñ
          msg: "El nombre y apellido solo puede contener letras con tildes, la letra ñ y espacios",
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
      },
    },
    Contrasenia: {
      type: sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8],
          msg: "La contraseña debe tener 60 caracteres",
        },
        notNull: {
          msg: "La contraseña es requerida",
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
    tableName: "Clientes", // Nombre de la tabla en la base de datos
    timestamps: false, // No se incluirán campos createdAt y updatedAt
  }
);

module.exports = clienteModel; // Exportar el modelo de cliente para su uso en otras partes de la aplicación

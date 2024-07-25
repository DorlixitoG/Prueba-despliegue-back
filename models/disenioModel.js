const sequelize = require("sequelize");
const db = require("../db");

// Definición del modelo de clientes
const disenioModel = db.define(
  "Disenios", // Nombre del modelo en la base de datos
  {
    IdDisenio: {
      type: sequelize.INTEGER, // Tipo de dato: INTEGER
      primaryKey: true, // Campo clave primaria
      autoIncrement: true, // Se autoincrementa automáticamente
      allowNull: false,
    },
    NombreDisenio: {
      type: sequelize.STRING, // Tipo de dato: STRING
    },
    Fuente: {
      type: sequelize.STRING, // Tipo de dato: STRING
    },
    TamanioFuente: {
      type: sequelize.STRING, // Tipo de dato: INTEGER
    },
    ColorFuente: {
      type: sequelize.STRING, // Tipo de dato: STRING
    },
    PosicionFuente: {
      type: sequelize.STRING, // Tipo de dato: STRING
    },
    TamanioImagen: {
      type: sequelize.STRING, // Tipo de dato: INTEGER
    },
    PosicionImagen: {
      type: sequelize.STRING, // Tipo de dato: STRING
    },
    PrecioDisenio: {
      type: sequelize.DOUBLE, // Tipo de dato: STRING
    },
    IdImagenDisenio:{
      type: sequelize.STRING, // Tipo de dato: STRING
    },
    ImagenDisenio: {
      type: sequelize.STRING(255), // Tipo de dato: STRING
    },
    IdImagenReferencia:{
      type: sequelize.STRING, // Tipo de dato: STRING

    },
    ImagenReferencia: {
      type: sequelize.STRING(255), // Tipo de dato: STRING
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
    tableName: "Disenios", // Nombre de la tabla en la base de datos
    timestamps: false, // No se incluirán campos createdAt y updatedAt
  }
);

module.exports = disenioModel; // Exportar el modelo de cliente para su uso en otras partes de la aplicación

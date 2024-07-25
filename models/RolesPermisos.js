const Sequelize = require("sequelize");
const db = require("../db");
const rolModel = require("./rolModel");
const permisoModel = require("./permisoModel");

const rolPermisoModel = db.define(
  "RolesPermisos",
  {
    IdRolPermiso: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    IdRol: {
      type: Sequelize.INTEGER,
      references: {
        model: rolModel,
        key: "IdRol",
      },
      allowNull: false,
    },
    IdPermiso: {
      type: Sequelize.INTEGER,
      references: {
        model: permisoModel,
        key: "IdPermiso",
      },
      allowNull: false,
    },
  },
  {
    tableName: "RolesPermisos", // Nombre de la tabla en la base de datos
    timestamps: false, // Evitar que Sequelize añada createdAt y updatedAt
  }
);

// Definir las relaciones después de exportar el modelo
rolModel.belongsToMany(permisoModel, {
  through: rolPermisoModel,
  foreignKey: "IdRol",
});
permisoModel.belongsToMany(rolModel, {
  through: rolPermisoModel,
  foreignKey: "IdPermiso",
});

module.exports = rolPermisoModel;

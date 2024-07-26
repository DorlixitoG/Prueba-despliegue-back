const { Sequelize } = require("sequelize");
const fs = require('fs');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.UriMysql,
  {
    dialect: "mysql",
  }
);

async function initializeData() {
  const permisoModel = require('./models/permisoModel');
  const estadosPedidosModel = require('./models/estadosPedidosModel'); 

  const permisos = [
    "Dashboard",
    "Configuración",
    "Usuarios",
    "Proveedores",
    "Insumos",
    "Colores",
    "Tallas",
    "Compras",
    "Productos",
    "Diseños",
    "Clientes",
    "Ventas",
    "Pedidos"
  ];

  const estados = [
    "Finalizado",
    "Pendiente",
    "Cancelado"
  ];

  // Inserción de permisos
  const existingPermisos = await permisoModel.findAll({
    attributes: ['Permiso'],
    raw: true,
  });

  const existingPermisosSet = new Set(existingPermisos.map(p => p.Permiso));
  const newPermisos = permisos.filter(permiso => !existingPermisosSet.has(permiso));

  if (newPermisos.length > 0) {
    await permisoModel.bulkCreate(
      newPermisos.map(permiso => ({ Permiso: permiso }))
    );
    console.log("Datos de permisos iniciales insertados correctamente.");
  } else {
    console.log("No se encontraron nuevos permisos para insertar.");
  }

  // Inserción de estados de pedidos
  const existingEstados = await estadosPedidosModel.findAll({
    attributes: ['NombreEstado'],
    raw: true,
  });

  const existingEstadosSet = new Set(existingEstados.map(e => e.NombreEstado));
  const newEstados = estados.filter(estado => !existingEstadosSet.has(estado));

  if (newEstados.length > 0) {
    await estadosPedidosModel.bulkCreate(
      newEstados.map(estado => ({ NombreEstado: estado }))
    );
    console.log("Datos de estados de pedidos iniciales insertados correctamente.");
  } else {
    console.log("No se encontraron nuevos estados para insertar.");
  }
}

sequelize
  .authenticate()
  .then(async () => {
    console.log("Conexión a la base de datos exitosa.");


    // await sequelize.sync({ alter: true });
    // console.log("Base de datos sincronizada con los modelos.");

    await initializeData();
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos o sincronizar:", err);
  });

module.exports = sequelize;

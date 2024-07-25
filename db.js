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
    console.log("Datos iniciales insertados correctamente.");
  } else {
    console.log("No se encontraron nuevos datos para insertar.");
  }
}

sequelize
  .authenticate()
  .then(async () => {
    console.log("Conexión a la base de datos exitosa.");

    // Leer el archivo de sincronización
    const syncFlag = JSON.parse(fs.readFileSync('syncFlag.json', 'utf8'));

    if (!syncFlag.synced) {
      // Sincronizar los modelos con la base de datos
      await sequelize.sync({ alter: true });

      // Marcar la sincronización como realizada
      syncFlag.synced = true;
      fs.writeFileSync('syncFlag.json', JSON.stringify(syncFlag));

      // Inicializar los datos después de sincronizar
      await initializeData();
    } else {
      console.log("La base de datos ya ha sido sincronizada previamente. No se requieren cambios.");
    }
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos o sincronizar:", err);
  });

module.exports = sequelize;

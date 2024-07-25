// Importa el paquete 'express' para crear y configurar el servidor
const express = require("express");
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
// Crea una instancia de la aplicación Express
const app = express();
//seteamos el motor de plantillas
// app.set('view engine', 'ejs')
//seteamos la carpeta public para archivos estáticos
// app.use(express.static('public'))
//para procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())
//seteamos las variables de entorno
// dotenv.config({path: '.env'})
//para poder trabajar con las cookies
app.use(cookieParser())
//llamar al router
// app.use('/', require('./routes/router'))
//Para eliminar la cache 
// app.use(function(req, res, next) {
//   if (!req.user)
//       res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//   next();
// });






// Importa el paquete 'body-parser' para analizar las solicitudes entrantes con formato JSON
const bodyParser = require("body-parser");

const cors = require('cors')

// Importa las rutas definidas para los diferentes recursos (clientes, detalles de compras y pedidos)
const clienteRoutes = require("./routes/clienteRoute");
const pedidoRoutes = require("./routes/pedidoRoute");
const estadoPedidoRoutes = require("./routes/estadosPedidosRoute");

const proveedorRoutes = require("./routes/proveedorRoute");
const insumoRoutes = require("./routes/insumoRoute");
const disenioRoutes = require("./routes/disenioRoute");
const productoRoutes = require("./routes/productoRoute");
// const dellatePedidoProductoRoutes = require("./routes/dellatePedidoProductoRoute");
const compraRoutes = require("./routes/compraRoute");
const tallasRoutes=require("./routes/tallaRoute")
const coloresRoutes=require("./routes/colorRoute")
const usuarioRoutes=require("./routes/usuarioRoute")
const rolRoutes=require("./routes/rolRoute")
const permisoRoutes=require("./routes/permisoRoute")
const authmovil=require("./routes/authMovilesRoute")
const forgotMovil= require("./routes/forgotPassRoute")
const resetPassMovil= require("./routes/resetPasswordRoute")



// Configura el middleware bodyParser para analizar las solicitudes entrantes con formato JSON
// app.use(bodyParser.json());

// Configurar el límite de tamaño del payload
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


// Configurar CORS para que permitar aceptar solicitudes del puerto

// Configurar CORS para que permitar aceptar solicitudes del puerto
const allowedOrigins = ['http://localhost:8081', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


// Asocia las rutas de clientes, detalles de compras y pedidos a las rutas base "/api/clientes", "/api/detallesCompras" y "/api/pedidos", respectivamente
app.use("/api/clientes", clienteRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/estadosPedidos", estadoPedidoRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/insumos", insumoRoutes);
app.use("/api/disenios", disenioRoutes);
app.use("/api/productos", productoRoutes);
// app.use("/api/dellatePedidoProductos", dellatePedidoProductoRoutes);
app.use("/api/compras", compraRoutes);
app.use("/api/colores",coloresRoutes)
app.use("/api/tallas",tallasRoutes)
app.use("/api/usuarios",usuarioRoutes)
app.use("/api/roles",rolRoutes)
app.use("/api/permisos",permisoRoutes)
app.use("/api/authMovil/login",authmovil)
app.use("/api/forgot-password",forgotMovil)
app.use("/api/reset-password",resetPassMovil)





// Middleware para manejar errores cuando no se encuentra una ruta
app.use((req, res, next) => {
  const error = new Error("Ruta no encontrada"); // Crea un nuevo error
  error.status = 404; // Establece el código de estado del error a 404 (No encontrado)
  next(error); // Pasa el error al siguiente middleware
});

// Middleware para manejar otros tipos de errores
app.use((error, req, res, next) => {
  res.status(error.status || 500); // Establece el código de estado de la respuesta al código de estado del error o 500 (Error interno del servidor)
  res.json({
    error: {
      message: error.message, // Envía un mensaje de error con el mensaje del error
    },
  });
});

// Define el número de puerto donde el servidor escuchará las solicitudes, utilizando el número de puerto del entorno o el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;

// Inicia el servidor y lo hace escuchar en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`); // Muestra un mensaje en la consola indicando que el servidor está en funcionamiento
});

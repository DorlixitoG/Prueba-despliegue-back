const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const conexion = require("../db");
const { promisify } = require("util");
const Cliente = require("../models/clienteModel");
const UsuarioModel = require("../models/usuarioModel");

const loginCliente = async (req, res) => {
  try {
    const { Usuario, Contrasenia } = req.body;

    console.log(Usuario);
    console.log(Contrasenia);

    if (!Usuario || !Contrasenia) {
      return res
        .status(400)
        .json({ message: "Usuario o contraseña no pueden estar vacíos" });
    } else {
      // Busca un usuario con el nombre de usuario proporcionado
      const foundUser = await Cliente.findOne({ where: { Usuario } });
      if (
        !foundUser ||
        !(await bcryptjs.compare(Contrasenia, foundUser.Contrasenia))
      ) {
        return res.status(401).json({
          message: "Usuario y/o Password incorrectas",
        });
      }

      const id = foundUser.IdCliente;
      const name = foundUser.NombreApellido;
      const token = jwt.sign({ id,name  }, process.env.JWT_SECRETO, {
        expiresIn: process.env.JWT_TIEMPO_EXPIRA,
      });

      const cookiesOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure:true,
        sameSite: 'lax'
      };

      console.log("TOKEN: "+token+" para el USUARIO : "+Usuario)


      res.cookie("jwt", token, cookiesOptions);

      return res.status(200).json({
        message: "¡LOGIN CORRECTO!",
        token
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error del servidor",  error: error.errors[0].message
    });
  }
};

const loginUsuario = async (req, res) => {
    try {
      const { Usuario, Contrasenia } = req.body;
  
      console.log(Usuario);
      console.log(Contrasenia);
  
      console.log("mamaweboDIoooooooooooooooJJIIJJIIJJI");
      if (!Usuario || !Contrasenia) {
        return res
          .status(400)
          .json({ message: "Usuario o contraseña no pueden estar vacíos" });
      } else {
        // Busca un usuario con el nombre de usuario proporcionado
        const foundUser = await UsuarioModel.findOne({ where: { Usuario } });

        // if (
        //   !foundUser ||
        //   !(await bcryptjs.compare(Contrasenia, foundUser.Contrasenia))
        // ) {
        //   return res.status(401).json({
        //     message: "Usuario y/o Password incorrectas",
        //   });
        // }
  
        const id = foundUser.Correo;
        const idRol = foundUser.IdRol;
        const token = jwt.sign({ id, idRol  }, process.env.JWT_SECRETO, {
          expiresIn: process.env.JWT_TIEMPO_EXPIRA,
        });
  
        const cookiesOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true,
          secure:true,
          sameSite: 'lax'
        };
  
        console.log("TOKEN: "+token+" para el USUARIO : "+Usuario)
  
  
        res.cookie("jwt", token, cookiesOptions);
  
        return res.status(200).json({
          message: "¡LOGIN CORRECTO!",
          token
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error del servidor", error: error.errors[0].message
      });
    }
  };
  


// exports.isAuthenticated = async (req, res, next)=>{
//     if (req.cookies.jwt) {
//         try {
//             const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
//             conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results)=>{
//                 if(!results){return next()}
//                 req.user = results[0]
//                 return next()
//             })
//         } catch (error) {
//             console.log(error)
//             return next()
//         }
//     }else{
//         res.redirect('/login')
//     }
// }

// exports.logout = (req, res)=>{
//     res.clearCookie('jwt')
//     return res.redirect('/')
// }

module.exports = { loginCliente,loginUsuario };

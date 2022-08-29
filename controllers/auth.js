const { request, response } = require("express");
const { Usuario } = require("../models");
const {
  existeUsuarioDB,
  validaPassword,
  generarJWT,
  googleVerify,
} = require("../helpers");

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe
    const usuario = await existeUsuarioDB(correo.trim());
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario / Password no son correctos",
      });
    }

    // Verificar si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario estado: inactivo",
      });
    }

    // verirficar la contraseña
    const passwordValid = validaPassword(password, usuario.password);
    if (!passwordValid) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario / Password no son correctos",
      });
    }

    // generar el token
    const token = await generarJWT(usuario.id);
    if (!token) {
      return res.status(400).json({
        ok: false,
        msg: token,
      });
    }

    // Si pasa todas la validaciones esta autenticado
    res.status(200).json({
      ok: true,
      msg: "Usuario Autenticado",
      usuario,
      token,
    });
  } catch (error) {
    //Error 500 algo salio mal
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado, contacte al administrador",
    });
  }
};

const googleSingIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, nombre, img } = await googleVerify(id_token);

    //Verificar si el correo ya existe
    let usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      //Crear el usuario
      const data = {
        correo,
        nombre,
        password: "",
        img,
        google: true,
      };
      usuario = new Usuario(data);
      await usuario.save();
    }

    //Verificar usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        ok: false,
        msg: "Hable con el administrador, Usuario bloqueado",
      });
    }

    // generar el token
    const token = await generarJWT(usuario.id);
    if (!token) {
      return res.status(400).json({
        ok: false,
        msg: token,
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Todo OK Google",
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Error Google Singin...",
      error,
    });
  }
};

const renovarToken = async (req, res = response) => {
  const { usuario } = req;

  // Generar el JWT
  const token = await generarJWT(usuario.id);

  res.json({
    ok: true,
    msg: "Token Renovado",
    usuario,
    token,
  });
};

module.exports = {
  login,
  googleSingIn,
  renovarToken,
};

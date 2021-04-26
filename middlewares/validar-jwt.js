const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const { traeUsuarioID } = require("../helpers");

const validarJWT = async (req = request, res = response, next) => {
  //x-token Headers
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token de sesión en la solicitud",
    });
  }

  try {
    // En este token solo se esta enviando el uid, pero se puede enviar mas informacion
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const { uid, iat, exp } = payload;
    const usuario = await traeUsuarioID(uid);
    //Verificar que el uisuario exista
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Sesión no válida - usuario no existe",
      });
    }
    //Verificar que el uisuario este activo
    if (!usuario.estado) {
      return res.status(401).json({
        ok: false,
        msg: "Sesión no válida - usuario inactivo",
      });
    }
    req.usuario = usuario;
    req.iat = iat;
    req.exp = exp;
  } catch (error) {
    console.log(error);
    res.status(401).json({
      ok: false,
      // msg: "Token no Válido",
      msg: "Sesión expirada",
    });
  }
  next();
};

module.exports = {
  validarJWT,
};

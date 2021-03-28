const { request, response } = require("express");
const { validationResult } = require("express-validator");

const validarCampos = (req = request, res = response, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const { errors } = errores;
    return res.status(400).json({
      ok: false,
      msg: "Verificar errores",
      errors,
    });
  }

  next();
};

module.exports = {
  validarCampos,
};

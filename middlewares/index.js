const validaCampos = require("./validar-campos");
const validaJWT = require("./validar-jwt");
const validaRoles = require("./validar-roles");
const validarArchivos = require("./validar-archivos");

module.exports = {
  ...validaCampos,
  ...validaJWT,
  ...validaRoles,
  ...validarArchivos,
};

const encripta = require("./cryp");
const dbvalidators = require("./db-validators");
const extenciones = require("./extensiones");
const token = require("./jwt");
const retornarModelo = require("./retornarModelo");
const paths = require("./paths");

module.exports = {
  ...encripta,
  ...dbvalidators,
  ...extenciones,
  ...token,
  ...retornarModelo,
  ...paths,
};

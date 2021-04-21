const encripta = require("./cryp");
const dbvalidators = require("./db-validators");
const extenciones = require("./extensiones");
const token = require("./jwt");
const retornarModelo = require("./retornarModelo");
const paths = require("./paths");
const isDate = require("./isDate");

module.exports = {
  ...encripta,
  ...dbvalidators,
  ...extenciones,
  ...isDate,
  ...token,
  ...retornarModelo,
  ...paths,
};

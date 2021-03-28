const encripta = require("./cryp");
const dbvalidators = require("./db-validators");
const extenciones = require("./extensiones");
const token = require("./jwt");
const uploadfile = require("./upload-file");
const uploadfileCloudinary = require("./upload-file-cloudinay");
const retornarModelo = require("./retornarModelo");
const paths = require("./paths");

module.exports = {
  ...encripta,
  ...dbvalidators,
  ...extenciones,
  ...token,
  ...uploadfile,
  ...retornarModelo,
  ...paths,
  ...uploadfileCloudinary,
};

const auth = require("./auth");
const conyuges = require("./conyuges");
const documentos = require("./documentos");
const matrimonios = require("./matrimonios");
const diocesis = require("./diocesis");
const params = require("./param");
const search = require("./search");
const usuarios = require("./usuarios");
const uploadsCloudinary = require("./uploads-cloudinary");
const _1010 = require("./1010");

module.exports = {
  ..._1010,
  ...auth,
  ...conyuges,
  ...documentos,
  ...matrimonios,
  ...diocesis,
  ...params,
  ...search,
  ...usuarios,
  ...uploadsCloudinary,
};

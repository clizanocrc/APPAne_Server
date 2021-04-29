const auth = require("./auth");
const conyuges = require("./conyuges");
const documentos = require("./documentos");
const matrimonios = require("./matrimonios");
const diocesis = require("./diocesis");
const params = require("./param");
const search = require("./search");
const usuarios = require("./usuarios");
const uploadsCloudinary = require("./uploads-cloudinary");
const blogs = require("./blogs");
const calendario = require("./calendario");

module.exports = {
  ...blogs,
  ...auth,
  ...conyuges,
  ...documentos,
  ...matrimonios,
  ...diocesis,
  ...calendario,
  ...params,
  ...search,
  ...usuarios,
  ...uploadsCloudinary,
};

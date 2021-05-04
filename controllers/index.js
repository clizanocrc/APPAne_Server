const auth = require("./auth");
const conyuges = require("./conyuges");
const matrimonios = require("./matrimonios");
const diocesis = require("./diocesis");
const params = require("./param");
const search = require("./search");
const usuarios = require("./usuarios");
const uploadsCloudinary = require("./uploads-cloudinary");
const blogs = require("./blogs");
const calendario = require("./calendario");
const sockets = require("./sockets");
const notificaciones = require("./notificaciones");

module.exports = {
  ...blogs,
  ...auth,
  ...conyuges,
  ...matrimonios,
  ...diocesis,
  ...calendario,
  ...params,
  ...search,
  ...usuarios,
  ...uploadsCloudinary,
  ...sockets,
  ...notificaciones,
};

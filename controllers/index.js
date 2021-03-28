const auth = require("./auth");
const conyuges = require("./conyuges");
const matrimonios = require("./matrimonios");
const diocesis = require("./diocesis");
const search = require("./search");
const usuarios = require("./usuarios");
const uploads = require("./uploads");
const uploadsCloudinary = require("./uploads-cloudinary");

module.exports = {
  ...auth,
  ...conyuges,
  ...matrimonios,
  ...diocesis,
  ...search,
  ...uploads,
  ...usuarios,
  ...uploadsCloudinary,
};

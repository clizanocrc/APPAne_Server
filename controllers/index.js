const auth = require("./auth");
const conyuges = require("./conyuges");
const matrimonios = require("./matrimonios");
const diocesis = require("./diocesis");
const params = require("./param");
const search = require("./search");
const usuarios = require("./usuarios");
const uploads = require("./uploads");
const uploadsCloudinary = require("./uploads-cloudinary");
const _1010 = require("./1010");

module.exports = {
  ..._1010,
  ...auth,
  ...conyuges,
  ...matrimonios,
  ...diocesis,
  ...params,
  ...search,
  ...uploads,
  ...usuarios,
  ...uploadsCloudinary,
};

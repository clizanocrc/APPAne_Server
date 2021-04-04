const path = require("path");

const pathImagenDefault = () => path.join(__dirname, "../assets/no-image.jpg");
const pathImg = (coleccion, nombre) =>
  path.join(__dirname, "../uploads/", coleccion, nombre);

const pathCloudinary = "APPAne";

module.exports = {
  pathImagenDefault,
  pathImg,
  pathCloudinary,
};

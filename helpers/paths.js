const path = require("path");

const pathImagenDefault = () => path.join(__dirname, "../assets/no-image.jpg");
const pathImg = (coleccion, nombre) =>
  path.join(__dirname, "../uploads/", coleccion, nombre);

module.exports = {
  pathImagenDefault,
  pathImg,
};

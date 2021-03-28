const { request, response } = require("express");
const { coleccionesSearch } = require("../search/colecciones");
const {
  searchUsuarios,
  searchCategorias,
  searchProductos,
  searchDefault,
  searchError,
  searchProdxCateID,
} = require("../controllers");

const search = (req = request, res = response) => {
  const { coleccion, termino } = req.params;
  if (!coleccionesSearch.includes(coleccion)) {
    return searchError(coleccionesSearch, coleccion, res);
  }
  switch (coleccion) {
    case "usuarios":
      searchUsuarios(termino, res);
      break;
    case "categorias":
      searchCategorias(termino, res);
      break;
    case "productos":
      searchProductos(termino, res);
      break;
    case "prodxcate":
      searchProdxCateID(termino, res);
      break;
    default:
      searchDefault(coleccion, res);
  }
};

module.exports = { search };

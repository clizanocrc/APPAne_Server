const { request, response } = require("express");
const { Usuario, Producto } = require("../models");

const retornarModelo = async (req = request, res = response) => {
  const { coleccion, id } = req.params;
  let modelo = [];
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          ok: false,
          msg: `Usuario con id: ${id} no existe`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          ok: false,
          msg: `Producto con id: ${id} no existe`,
        });
      }
      break;
    default:
      return res.status(500).json({
        ok: false,
        msg: "Contactar al administrador, Actualizar colección no implementada",
      });
  }
  return modelo;
};

module.exports = { retornarModelo };

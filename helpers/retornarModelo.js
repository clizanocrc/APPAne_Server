const { request, response } = require("express");
const {
  Usuario,
  Matrimonio,
  Conyuges,
  _1010,
  Documentos,
} = require("../models");

const retornarModelo = async (req = request, res = response) => {
  const { coleccion, id } = req.params;
  let modelo = [];
  switch (coleccion) {
    case "matrimonios":
      modelo = await Matrimonio.findById(id);
      if (!modelo) {
        return res.status(400).json({
          ok: false,
          msg: `Matrimonio con id: ${id} no existe`,
        });
      }
      break;
    case "conyuges":
      modelo = await Conyuges.findById(id);
      if (!modelo) {
        return res.status(400).json({
          ok: false,
          msg: `Conyuge con id: ${id} no existe`,
        });
      }
      break;
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          ok: false,
          msg: `Usuario con id: ${id} no existe`,
        });
      }
      break;
    case "1010":
      modelo = await _1010.findById(id);
      if (!modelo) {
        return res.status(400).json({
          ok: false,
          msg: `1010 con id: ${id} no existe`,
        });
      }
      break;
    case "documentos":
      modelo = await Documentos.findById(id);
      if (!modelo) {
        return res.status(400).json({
          ok: false,
          msg: `Documento con id: ${id} no existe`,
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

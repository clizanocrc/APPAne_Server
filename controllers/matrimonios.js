const { request, response } = require("express");
const { Matrimonio } = require("../models");

//Lista de Matrimonios
const getMatrimonios = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { activo: true };
  const [total, matrimonios] = await Promise.all([
    Matrimonio.countDocuments(query),
    Matrimonio.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre")
      .populate("diocesis", "nombre")
      .populate("esposo")
      .populate("esposa"),
  ]);
  res.status(200).json({
    ok: true,
    msg: "Lista de Matrimonios",
    total,
    matrimonios,
  });
};
//Obtener una Categoría por ID - público
const getMatrimoniobyID = async (req = request, res = response) => {
  const { id } = req.params;
  const matrimonioDB = await Matrimonio.findById(id)
    .populate("usuario", "nombre")
    .populate("diocesis", "nombre")
    .populate("esposo")
    .populate("esposa");
  res.status(200).json({
    ok: true,
    msg: "Matrimonio",
    matrimonio: matrimonioDB,
  });
};

const postMatrimonio = async (req = request, res = response) => {
  const { esposo, esposa, diocesis } = req.body;
  const nombrematrimonio = req.body.nombrematrimonio.toUpperCase();
  const matrimonioDB = await Matrimonio.findOne({ nombrematrimonio });
  if (matrimonioDB) {
    return res.status(400).json({
      ok: false,
      msg: `El Matrimonio ${matrimonioDB.nombrematrimonio} ya existe`,
    });
  }
  const data = {
    nombrematrimonio,
    esposo,
    esposa,
    diocesis,
    usuario: req.usuario._id,
  };
  const matrimonio = new Matrimonio(data);
  await matrimonio.save();

  return res.status(201).json({
    ok: true,
    msg: "matrimonio Creado ",
    matrimonio,
  });
};

const putMatrimonio = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;
  const matrimonio = await Matrimonio.findByIdAndUpdate(id, data, {
    new: true,
  });
  res.status(200).json({
    ok: true,
    msg: "Matrimonio actualizado",
    categoria,
  });
};

const deleteMatrimonio = async (req = request, res = response) => {
  const { id } = req.params;
  const matrimonio = await Matrimonio.findByIdAndUpdate(
    id,
    {
      estado: false,
      usuario: req.usuario._id,
    },
    { new: true }
  );

  res.status(200).json({
    ok: true,
    msg: "Matrimonio Eliminado",
    matrimonio,
  });
};
module.exports = {
  getMatrimonios,
  getMatrimoniobyID,
  postMatrimonio,
  putMatrimonio,
  deleteMatrimonio,
};

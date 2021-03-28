const { request, response } = require("express");
const { Diocesis } = require("../models");

const getDiocesis = async (req = request, res = response) => {
  //TODO: Validar si limite y desde son numeros
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, diocesis] = await Promise.all([
    Diocesis.countDocuments(query),
    Diocesis.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre"),
  ]);
  res.status(200).json({
    ok: true,
    msg: "Lista de Diócesis",
    total,
    diocesis,
  });
};

const getDiocesisobyID = async (req = request, res = response) => {
  const { id } = req.params;
  const diocesisDB = await Diocesis.findById(id).populate("usuario", "nombre");
  res.status(200).json({
    ok: true,
    msg: "Diocesis",
    diocesis: diocesisDB,
  });
};

//Crear Producto - privado - cualquier persona con Token válido
const postDiocesis = async (req = request, res = response) => {
  const { estado, usuario, ...body } = req.body;
  const diocesisDB = await Diocesis.findOne({ nombre: body.nombre });
  if (diocesisDB) {
    return res.status(400).json({
      ok: false,
      msg: `Diócesis ${diocesisDB.nombre} ya existe`,
    });
  }
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };
  const diocesis = new Diocesis(data);
  await diocesis.save();
  return res.status(201).json({
    ok: true,
    msg: "Diócesis Creada",
    diocesis,
  });
};

const putDiocesis = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  data.usuario = req.usuario._id;
  const diocesis = await Diocesis.findByIdAndUpdate(id, data, { new: true });
  res.status(200).json({
    ok: true,
    msg: "Diócesis actualizada",
    diocesis,
  });
};

const deleteDiocesis = async (req = request, res = response) => {
  const { id } = req.params;
  const diocesis = await Diocesis.findByIdAndUpdate(
    id,
    {
      estado: false,
      usuario: req.usuario._id,
    },
    { new: true }
  );

  res.status(200).json({
    ok: true,
    msg: "Diócesis Eliminada",
    diocesis,
  });
};
module.exports = {
  getDiocesis,
  getDiocesisobyID,
  postDiocesis,
  putDiocesis,
  deleteDiocesis,
};

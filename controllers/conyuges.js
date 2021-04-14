const { request, response } = require("express");
const { Conyuges } = require("../models");

const getConyuges = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, conyuges] = await Promise.all([
    Conyuges.countDocuments(query),
    Conyuges.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre"),
  ]);
  // console.log(conyuges);
  res.status(200).json({
    ok: true,
    msg: "Lista de Cónyuges",
    total,
    conyuges,
  });
};

const getConyugebyID = async (req = request, res = response) => {
  const { id } = req.params;
  const conyugeDB = await Conyuges.findById(id).populate("usuario", "nombre");
  res.status(200).json({
    ok: true,
    msg: "Cónyuge",
    conyuge: conyugeDB,
  });
};

const postConyuge = async (req = request, res = response) => {
  const { estado, usuario, ...body } = req.body;
  //TODO: buscar que el conyuge exista no tiene sentido

  const conyugeDB = await Conyuges.findOne({ nombre: body.nombre });
  if (conyugeDB) {
    return res.status(400).json({
      ok: false,
      msg: `Cónyuge ${conyugeDB.nombre} ya existe`,
    });
  }
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };
  if (data.apellido) {
    data.apellido = data.apellido.toUpperCase();
  }
  const conyuge = new Conyuges(data);
  await conyuge.save();
  return res.status(201).json({
    ok: true,
    msg: "Conyuge Creado",
    data: conyuge,
  });
};

const putConyuge = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  if (data.apellido) {
    data.apellido = data.apellido.toUpperCase();
  }
  data.usuario = req.usuario._id;
  const conyuge = await Conyuges.findByIdAndUpdate(id, data, { new: true });
  res.status(200).json({
    ok: true,
    msg: "Cónyuge actualizado",
    conyuge,
  });
};

const deleteConyuge = async (req = request, res = response) => {
  const { id } = req.params;
  const { permanente } = req.body;

  if (permanente) {
    const conyuge = await Conyuges.findByIdAndDelete(id);
    res.status(200).json({
      ok: true,
      msg: "Cónyuge Eliminado, Permanente",
      conyuge,
    });
  } else {
    const conyuge = await Conyuges.findByIdAndUpdate(
      id,
      {
        estado: false,
        usuario: req.usuario._id,
      },
      { new: true }
    );
    res.status(200).json({
      ok: true,
      msg: "Cónyuge Eliminado",
      conyuge,
    });
  }
};
module.exports = {
  getConyuges,
  getConyugebyID,
  postConyuge,
  putConyuge,
  deleteConyuge,
};

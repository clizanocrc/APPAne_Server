const { request, response } = require("express");
const { Param } = require("../models");

const getParam = async (req = request, res = response) => {
  const params = await Param.find().populate("usuario", "nombre");
  res.status(200).json({
    ok: true,
    msg: "Parámetros",
    params,
  });
};

const postParams = async (req = request, res = response) => {
  const { usuario, ...body } = req.body;
  const paramsDB = await Param.find().populate("usuario", "nombre");

  if (paramsDB.length !== 0) {
    return res.status(400).json({
      ok: false,
      msg: `Los parámetros ya fueron inicializados`,
    });
  }
  const data = {
    ...body,
    usuario: req.usuario._id,
  };
  const params = new Param(data);
  await params.save();
  return res.status(201).json({
    ok: true,
    msg: "Parámetros Creados",
    params,
  });
};

const putParams = async (req = request, res = response) => {
  const { id } = req.params;
  const { usuario, ...data } = req.body;
  data.usuario = req.usuario._id;
  const params = await Param.findByIdAndUpdate(id, data, { new: true });
  res.status(200).json({
    ok: true,
    msg: "Parámetros actualizados",
    params,
  });
};

module.exports = {
  getParam,
  postParams,
  putParams,
};

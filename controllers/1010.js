const { request, response } = require("express");
const { _1010 } = require("../models");

const get1010 = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, _1010s] = await Promise.all([
    _1010.countDocuments(query),
    _1010
      .find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre"),
  ]);
  res.status(200).json({
    ok: true,
    msg: "Lista de 1010",
    total,
    _1010s,
  });
};

const get1010ByID = async (req = request, res = response) => {
  const { id } = req.params;
  const _1010DB = await _1010.findById(id).populate("usuario", "nombre");
  res.status(200).json({
    ok: true,
    msg: "1010",
    _1010: _1010DB,
  });
};

const post1010 = async (req = request, res = response) => {
  const { estado, usuario, titulo, ...body } = req.body;
  const _1010DB = await _1010.findOne({ titulo });
  if (_1010DB) {
    return res.status(400).json({
      ok: false,
      msg: `1010 ${titulo} ya existe`,
    });
  }
  const data = {
    ...body,
    datePubli: new Date().getTime(),
    titulo,
    usuario: req.usuario._id,
  };
  const __1010 = new _1010(data);
  await __1010.save();
  return res.status(201).json({
    ok: true,
    msg: "1010 Creado",
    _1010: __1010,
  });
};

const put1010 = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, titulo, ...data } = req.body;

  const _1010DB = await _1010.findOne({ titulo });
  if (_1010DB && _1010DB.id !== id) {
    return res.status(400).json({
      ok: false,
      msg: `1010 ${titulo} ya existe`,
    });
  }

  data.usuario = req.usuario._id;
  const __1010 = await _1010.findByIdAndUpdate(id, data, { new: true });
  res.status(200).json({
    ok: true,
    msg: "1010 actualizado",
    _1010: __1010,
  });
};

const delete1010 = async (req = request, res = response) => {
  const { id } = req.params;
  const __1010 = await _1010.findByIdAndUpdate(
    id,
    {
      estado: false,
      usuario: req.usuario._id,
    },
    { new: true }
  );

  res.status(200).json({
    ok: true,
    msg: "1010 Eliminado",
    _1010: __1010,
  });
};
module.exports = {
  get1010,
  get1010ByID,
  post1010,
  put1010,
  delete1010,
};
1010;

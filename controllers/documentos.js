const { request, response } = require("express");
const { Documentos } = require("../models");

const getDocumentos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, documentos] = await Promise.all([
    Documentos.countDocuments(query),
    Documentos.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre"),
  ]);
  res.status(200).json({
    ok: true,
    msg: "Lista de Documementos",
    total,
    documentos,
  });
};

const getDocumentoByID = async (req = request, res = response) => {
  const { id } = req.params;
  const DocumentoDB = await Documentos.findById(id).populate(
    "usuario",
    "nombre"
  );
  res.status(200).json({
    ok: true,
    msg: "1010",
    Documento: DocumentoDB,
  });
};

const postDocumento = async (req = request, res = response) => {
  const { estado, usuario, titulo, ...body } = req.body;
  const DocumentoDB = await Documentos.findOne({ titulo });
  if (DocumentoDB) {
    return res.status(400).json({
      ok: false,
      msg: `Documento ${titulo} ya existe`,
    });
  }
  const data = {
    ...body,
    datePubli: new Date().getTime(),
    titulo,
    usuario: req.usuario._id,
  };
  const documento = new Documentos(data);
  await documento.save();
  return res.status(201).json({
    ok: true,
    msg: "1010 Creado",
    documento,
  });
};

const putDocumento = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, titulo, ...data } = req.body;

  const DocumentoDB = await Documentos.findOne({ titulo });
  if (DocumentoDB && DocumentoDB.id !== id) {
    return res.status(400).json({
      ok: false,
      msg: `Documento ${titulo} ya existe`,
    });
  }

  data.usuario = req.usuario._id;
  const documento = await Documentos.findByIdAndUpdate(id, data, {
    new: true,
  });
  res.status(200).json({
    ok: true,
    msg: "Documento actualizado",
    documento,
  });
};

const deleteDocumento = async (req = request, res = response) => {
  const { id } = req.params;
  const documento = await Documentos.findByIdAndUpdate(
    id,
    {
      estado: false,
      usuario: req.usuario._id,
    },
    { new: true }
  );

  res.status(200).json({
    ok: true,
    msg: "Documento Eliminado",
    documento,
  });
};
module.exports = {
  getDocumentos,
  getDocumentoByID,
  postDocumento,
  putDocumento,
  deleteDocumento,
};
1010;

const { request, response } = require("express");
const { Matrimonio, Conyuges } = require("../models");

//Lista de Matrimonios
const getMatrimonios = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { activo: true, esMatrimonio: true };
  const queryS = { activo: true, esMatrimonio: false };

  const [total, matrimonios] = await Promise.all([
    Matrimonio.countDocuments(query),
    Matrimonio.find(query)
      .sort({ nombrematrimonio: 1 })
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre")
      .populate("esposo")
      .populate("esposa")
      .populate("diocesis"),
  ]);

  const [totalS, sacerdotes] = await Promise.all([
    Matrimonio.countDocuments(queryS),
    Matrimonio.find(queryS)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre")
      .populate("diocesis"),
  ]);

  res.status(200).json({
    ok: true,
    msg: "Lista de Registros",
    total,
    matrimonios,
    totalS,
    sacerdotes,
  });
};
//Obtener una Categoría por ID - público
const getMatrimoniobyID = async (req = request, res = response) => {
  const { id } = req.params;
  const matrimonioDB = await Matrimonio.findById(id)
    .populate("usuario", "nombre")
    .populate("esposo")
    .populate("esposa")
    .populate("diocesis");
  if (!matrimonioDB.activo) {
    return res.status(400).json({
      ok: false,
      msg: "Matrimonio Inactivo",
    });
  }
  res.status(200).json({
    ok: true,
    msg: "Matrimonio",
    data: matrimonioDB,
  });
};

const postMatrimonio = async (req = request, res = response) => {
  const { esposo, esposa, ...resto } = req.body;
  const matrimonioDB = await Matrimonio.find({
    $or: [{ esposo }, { esposa }],
  });
  if (esposo && esposa) {
    if (matrimonioDB.length !== 0) {
      return res.status(400).json({
        ok: false,
        msg: `Alguno de los cónyuges ya se encuentra registrado`,
      });
    }
  }
  const data = {
    ...resto,
    esposo,
    esposa,
    usuario: req.usuario._id,
  };
  const matrimonio = new Matrimonio(data);
  await matrimonio.save();
  await Promise.all([
    Conyuges.findByIdAndUpdate(esposo, {
      idMatrimonio: matrimonio.id,
    }),

    Conyuges.findByIdAndUpdate(esposa, {
      idMatrimonio: matrimonio.id,
    }),
  ]);
  return res.status(201).json({
    ok: true,
    msg: "Matrimonio Creado",
    data: matrimonio,
  });
};

const putMatrimonio = async (req = request, res = response) => {
  const { id } = req.params;
  const { esposo, esposa, ...resto } = req.body;

  const data = {
    ...resto,
    usuario: req.usuario._id,
  };

  const matrimonio = await Matrimonio.findByIdAndUpdate(id, data, {
    new: true,
  });
  res.status(200).json({
    ok: true,
    msg: "Matrimonio actualizado",
    data: matrimonio,
  });
};

const deleteMatrimonio = async (req = request, res = response) => {
  const { id } = req.params;
  const matrimonio = await Matrimonio.findByIdAndUpdate(
    id,
    {
      activo: false,
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

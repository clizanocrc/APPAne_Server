const { response, request } = require("express");
const { Evento } = require("../models");

//Lista de Eventos
const getEventos = async (req = request, res = response) => {
  const { limite = 5, desde = 0, orden = "asc" } = req.query;
  const query = { activo: true };
  let order;
  if (orden === "asc") {
    order = 1;
  } else {
    order = -1;
  }

  const [total, eventos] = await Promise.all([
    Evento.countDocuments(query),
    Evento.find(query)
      .sort({ end: order })
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("user", "nombre"),
  ]);

  res.status(200).json({
    ok: true,
    msg: "Lista de Eventos",
    total,
    eventos,
  });
};

const newEvento = async (req, res = response) => {
  const { user, ...resto } = req.body;
  const data = {
    ...resto,
    user: user._id,
  };
  console.log(data);
  const evento = new Evento(data);
  try {
    evento.user = req.usuario._id;
    const eventoSave = await evento.save();

    res.status(201).json({
      ok: true,
      evento: eventoSave,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Comunicarse con el Administrador",
      msg2: error,
    });
  }
};

const updateEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.usuario.id;
  try {
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "El evento no existe",
      });
    }

    if (evento.user._id.toString() !== uid.toString()) {
      return res.status(401).json({
        ok: false,
        msg: "No autorizado para modificar este evento",
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true }
    );

    res.status(200).json({
      ok: true,
      evento: eventoActualizado.populate("user", "nombre"),
      msg: "Evento Actualizado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Comunicarse con el Administrador",
      msg2: error,
    });
  }
};

const deleteEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.usuario.id;

  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "El evento no existe",
      });
    }

    if (evento.user._id.toString() !== uid.toString()) {
      return res.status(401).json({
        ok: false,
        msg: "No autorizado para eliminar este evento",
      });
    }

    const eventoAEliminar = await Evento.findByIdAndDelete(eventoId);

    res.status(200).json({
      ok: true,
      msg: "Evento Eliminado",
      evento: eventoAEliminar,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Comunicarse con el Administrador",
      msg2: error,
    });
  }
};

module.exports = {
  getEventos,
  newEvento,
  updateEvento,
  deleteEvento,
};

const { response, request } = require("express");
const Mensaje = require("../models/mensaje");

const obtenerChat = async (req = request, res = response) => {
  const miId = req.uid;
  const mensajesDe = req.params.de;
  const limite = 30;

  const lastMensajes = await Mensaje.find({
    $or: [
      { de: miId, para: mensajesDe },
      { de: mensajesDe, para: miId },
    ],
  })
    .sort({ createdAt: "asc" })
    .limit(limite);

  res.status(200).json({
    ok: true,
    mensajes: lastMensajes,
  });
};

module.exports = {
  obtenerChat,
};

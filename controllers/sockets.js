const Usuario = require("../models/usuario");
const Mensaje = require("../models/mensaje");

const usuarioConectado = async (uid, estado) => {
  const usuario = await Usuario.findById(uid);
  usuario.conectado = estado;
  await usuario.save();
  return usuario;
};

const getUsuariosOnline = async (uid) => {
  const query = { estado: true };

  const usuarios = await Usuario.find(query)
    .sort("-conectado")
    .sort({ nombre: 1 });

  return usuarios;
};

const grabarMessage = async (payload) => {
  try {
    const mensaje = new Mensaje(payload);
    await mensaje.save();
    return {
      ok: true,
      mensaje: mensaje,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      mensaje: [],
      msg: "Error al registrar el mensaje",
    };
  }
};

const obtenerChat = async (payload) => {
  const { miId, mensajesDe } = payload;
  const lastMensajes = await Mensaje.find({
    $or: [
      { de: miId, para: mensajesDe },
      { de: mensajesDe, para: miId },
    ],
  }).sort({ createdAt: "asc" });
  return {
    ok: true,
    chat: lastMensajes,
  };
};

const obtenerChatPendiente = async (uid) => {
  const mensajes = await Mensaje.find({
    $and: [{ para: uid, leido: false }],
  }).sort({ createdAt: "asc" });
  return {
    ok: true,
    chatSinLeer: mensajes,
  };
};

const chatLeido = async (uid) => {
  const mensajes = await Mensaje.findByIdAndUpdate(
    uid,
    {
      leido: true,
    },
    { new: true }
  );
  return {
    ok: true,
    msg: "Chat no Leido",
    mensajes: mensajes,
  };
};

module.exports = {
  usuarioConectado,
  getUsuariosOnline,
  grabarMessage,
  obtenerChat,
  chatLeido,
  obtenerChatPendiente,
};

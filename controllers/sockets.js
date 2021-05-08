const Usuario = require("../models/usuario");

const usuarioConectado = async (uid, estado) => {
  const usuario = await Usuario.findById(uid);
  usuario.conectado = estado;
  await usuario.save();
  return usuario;
};

const getUsuariosOnline = async () => {
  const query = { estado: true };

  const usuarios = await Usuario.find(query)
    .sort("-conectado")
    .sort({ nombre: 1 });
  return usuarios;
};

const grabarMessage = async (payload) => {
  try {
    const message = new Message(payload);
    await message.save();
    return message;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const obtenerChat = async (miId, mensajesDe) => {
  const lastMensajes = await Mensaje.find({
    $or: [
      { de: miId, para: mensajesDe },
      { de: mensajesDe, para: miId },
    ],
  }).sort({ createdAt: "asc" });

  return {
    ok: true,
    mensajes: lastMensajes,
  };
};

module.exports = {
  usuarioConectado,
  getUsuariosOnline,
  grabarMessage,
  obtenerChat,
};

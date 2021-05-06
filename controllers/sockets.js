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

module.exports = {
  usuarioConectado,
  getUsuariosOnline,
};

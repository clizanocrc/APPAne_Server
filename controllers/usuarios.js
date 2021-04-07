const { request, response } = require("express");
const { Usuario } = require("../models");
const { encriptaPassword, generarJWT } = require("../helpers");

const getUsuarios = async (req = request, res = response) => {
  //TODO: Validar si limite y desde son numeros
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  //Apilar las promesas para mejorar el rendimiento, las ejecuta simultaneamente
  //Se desestructura en un arreglo
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);
  res.status(200).json({
    ok: true,
    msg: "Lista de Usuarios",
    total,
    usuarios,
  });
};

const postUsuarios = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });
  //Encriptar la contraseña
  usuario.password = encriptaPassword(password);
  //Guardar en DB
  await usuario.save();
  const token = await generarJWT(usuario.id);

  res.status(201).json({
    ok: true,
    msg: "Usuario Creado",
    usuario,
    token,
  });
};

const putUsuarios = async (req = request, res = response) => {
  const { id } = req.params;
  //Estas son extracciones del objeto que no quiero actualizar
  //las otras propiedades se setean en resto
  const { _id, password, google, correo, ...resto } = req.body;
  if (password) {
    resto.password = encriptaPassword(password);
  }
  const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });
  res.status(200).json({
    ok: true,
    msg: "Usuario actualizado",
    usuario,
  });
};

const deleteUsuarios = async (req = request, res = response) => {
  //Borrado lógico de la base de datos
  const { id } = req.params;
  const usuario = await Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.status(200).json({
    ok: true,
    msg: "Usuario Eliminado - Lógico",
    usuario,
  });
};

const deletePermUsuarios = async (req = request, res = response) => {
  //Borrado físico de la base de datos
  //Solo en casos especiales para no alterar la entidad referencial de la base de datos
  const { id } = req.params;
  const usuarioAutenticado = req.usuario;
  if (usuarioAutenticado.rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      ok: false,
      msg: "Usuario no autorizado para realizar esta acción",
    });
  }
  const usuario = await Usuario.findByIdAndDelete(id, { new: true });
  res.status(200).json({
    ok: true,
    msg: "Usuario Eliminado permanentemente",
    usuario,
  });
};

const patchUsuarios = (req = request, res = response) => {
  res.status(200).json({
    ok: true,
    msg: "patch - controlador: respuesta del API",
    data: {},
  });
};

module.exports = {
  getUsuarios,
  postUsuarios,
  putUsuarios,
  deleteUsuarios,
  patchUsuarios,
  deletePermUsuarios,
};

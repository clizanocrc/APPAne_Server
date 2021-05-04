const { Notificaciones } = require("../models");

const getNotificacionesNuevas = (uid) => {};

const getNotificacionesLeidas = (uid) => {};

const getNotificacionesTodas = async (uid, io) => {
  const query = { para: uid };
  const [total, notificaciones] = await Promise.all([
    Notificaciones.countDocuments(query),
    Notificaciones.find(query)
      .sort({ fechaenviado: -1 })
      .populate("de", "nombre")
      .populate("para", "nombre"),
  ]);
  const resp = {
    ok: true,
    total: total,
    notificaciones: notificaciones,
  };
  io.to(uid).emit("tus-notificaciones-todas", resp);
};

const newNotificaciones = async (data, io) => {
  //TODO: Evaluar si es para todos los usuarios o para uno especifico

  const notificacion = new Notificaciones(data);
  await notificacion.save();
  await getNotificacionesTodas(data.para, io);
  await getNotificacionesTodas(data.de, io);
};

const deleteNotificaciones = (props) => {};

const editNotificacion = (props) => {};

const notificacionLeida = (props) => {};

module.exports = {
  getNotificacionesNuevas,
  getNotificacionesLeidas,
  getNotificacionesTodas,
  newNotificaciones,
  deleteNotificaciones,
  editNotificacion,
  notificacionLeida,
};

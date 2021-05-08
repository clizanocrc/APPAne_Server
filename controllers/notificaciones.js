const moment = require("moment");
const { Notificaciones, Usuario } = require("../models");
// const { enviarEmail } = require("../controllers/mail");
const getNotificacionesRecibidas = async (uid, io) => {
  const query = { para: uid };
  const notificacionesRecibidas = await Notificaciones.find(query)
    .sort({
      leido: 1,
    })
    .sort({ fechaenviado: -1 })
    .populate({ path: "de", select: "nombre images" })
    .populate({ path: "para", select: "nombre images" });

  const resp = {
    ok: true,
    notificacionesRecibidas,
  };
  io.to(uid).emit("tus-notificaciones-recibidas", resp);
};
const getNotificacionesEnviadas = async (uid, io) => {
  const query = { de: uid };
  const notificacionesEnviadas = await Notificaciones.find(query)
    .sort({
      leido: 1,
    })
    .sort({ fechaenviado: -1 })
    .populate({ path: "de", select: "nombre images" })
    .populate({ path: "para", select: "nombre images" });

  const resp = {
    ok: true,
    notificacionesEnviadas,
  };
  io.to(uid).emit("tus-notificaciones-enviadas", resp);
};
const getNotificacionesTodas = async (uid, io) => {
  const query = { $or: [{ para: uid }, { de: uid }] };
  const queryDe = { de: uid };
  const queryPara = { para: uid };

  const [
    total,
    notificacionesEnviadas,
    notificacionesRecibidas,
  ] = await Promise.all([
    Notificaciones.countDocuments(query),
    Notificaciones.find(queryDe)
      .sort({ leido: 1 })
      .sort({ fechaenviado: -1 })
      .populate({ path: "de", select: "nombre images" })
      .populate({ path: "para", select: "nombre images" }),
    Notificaciones.find(queryPara)
      .sort({ leido: 1 })
      .sort({ fechaenviado: -1 })
      .populate({ path: "de", select: "nombre images" })
      .populate({ path: "para", select: "nombre images" }),
  ]);
  const resp = {
    ok: true,
    total,
    notificacionesEnviadas,
    notificacionesRecibidas,
  };
  io.to(uid).emit("tus-notificaciones-todas", resp);
};
const newNotificaciones = async (data, io) => {
  // console.log(data);
  const { para } = data;
  try {
    if (para.length === 0) {
      return {
        ok: false,
        msg: "Debe seleccionar al menos un destinatario",
        error: null,
      };
    }
    if (data.title === "" || data.notes === "") {
      return {
        ok: false,
        msg: "Debe indicar el título o el mensaje",
        error: null,
      };
    }
    const destinatarios = data.para;
    const usuarioDe = await Usuario.findById(data.de);

    destinatarios.map(async (destino) => {
      // const usuarioPara = await Usuario.findById(destino.uid);
      // const emailData = {
      //   emailPara: usuarioPara.correo,
      //   nombreDe: usuarioDe.nombre,
      //   msg: `Tiene un mensaje nuevo de ${usuarioDe.nombre} en el APPAne, <hr/> ${data.notes}`,
      // };
      const dataEnviar = {
        title: data.title,
        notes: data.notes,
        para: destino.uid,
        de: data.de,
        fechaenviado: data.fechaenviado,
        leido: false,
        fechaleido: null,
      };
      const notificacion = new Notificaciones(dataEnviar);
      await notificacion.save();
      // await enviarEmail(emailData);
      await getNotificacionesRecibidas(destino.uid, io);
      await getNotificacionesEnviadas(data.de, io);
      io.to(destino.uid).emit("notifi-personal", {
        ok: true,
        images: usuarioDe.images,
        msg: "Ha recibido un nuevo mensaje de " + usuarioDe.nombre,
      });
    });
    // console.log("Enviando a", data.de);
    // await getNotificacionesEnviadas(data.de, io);

    return {
      ok: true,
      msg: "Notificación enviada",
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      msg: "No se puedo enviar, hay errores",
      error,
    };
  }
};
const deleteNotificaciones = (props) => {};
const editNotificacion = (props) => {};
const notificacionLeida = async (data, io) => {
  const { id, de, para } = data;
  const emisor = de._id;
  const receptor = para._id;

  const dataNew = {
    id: data.id,
    de: data.de,
    fechaenviado: data.fechaenviado,
    fechaleido: moment(),
    leido: true,
    notes: data.notes,
    para: data.para,
    title: data.title,
  };

  await Notificaciones.findByIdAndUpdate(id, dataNew, {
    new: true,
  });

  const notifi = await Notificaciones.findById(id)
    .populate({ path: "de", select: "nombre images" })
    .populate({ path: "para", select: "nombre images" });

  if (!notifi) {
    return {
      ok: false,
      msg: "No encontré el mensaje",
      error: null,
    };
  }

  await getNotificacionesTodas(emisor, io);
  await getNotificacionesTodas(receptor, io);
  return {
    ok: true,
    msg: "Notificación leída",
    error: null,
    notificacion: notifi,
  };
};

module.exports = {
  getNotificacionesRecibidas,
  getNotificacionesEnviadas,
  getNotificacionesTodas,
  newNotificaciones,
  deleteNotificaciones,
  editNotificacion,
  notificacionLeida,
};

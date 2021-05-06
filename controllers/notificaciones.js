const { Notificaciones, Usuario } = require("../models");
const { enviarEmail } = require("../controllers/mail");

const getNotificacionesNuevas = (uid) => {};

const getNotificacionesLeidas = (uid) => {};

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
      .sort({ fechaenviado: -1 })
      .populate({ path: "de", select: "nombre images" })
      .populate({ path: "para", select: "nombre images" }),
    Notificaciones.find(queryPara)
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
    destinatarios.map(async (destino) => {
      const usuarioPara = await Usuario.findById(destino.uid);
      const usuarioDe = await Usuario.findById(data.de);
      const emailData = {
        emailPara: usuarioPara.correo,
        nombreDe: usuarioDe.nombre,
        msg: `Tiene un mensaje nuevo de ${usuarioDe.nombre} en el APPAne, <hr/> ${data.notes}`,
      };
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
      await enviarEmail(emailData);
      await getNotificacionesTodas(destino.uid, io);
      io.to(destino.uid).emit("notifi-personal", {
        ok: true,
        images: usuarioDe.images,
        msg: "Ha recibido un nuevo mensaje de " + usuarioDe.nombre,
      });
    });
    await getNotificacionesTodas(data.de, io);

    return {
      ok: true,
      msg: "Notificaciones enviada",
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

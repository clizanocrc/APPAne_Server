const { verificarJWT } = require("../helpers/jwt");
const {
  usuarioConectado,
  getUsuariosOnline,
  getNotificacionesTodas,
  newNotificaciones,
  notificacionLeida,
  grabarMessage,
  obtenerChat,
} = require("../controllers");

class Sockets {
  constructor(io) {
    this.io = io;
    this.socketEvents();
  }

  socketEvents() {
    this.io.on("connection", async (socket) => {
      const [valido, uid] = verificarJWT(socket.handshake.query["x-token"]);
      if (!valido) {
        console.log("Socket no identificado");
        return socket.disconnect();
      }

      const usuario = await usuarioConectado(uid, true);
      socket.join(uid);
      console.log(usuario.nombre, "se conectó");
      this.io.emit("lista-usuarios", await getUsuariosOnline());
      await getNotificacionesTodas(uid, this.io);

      //Desconeccion del Usuario
      socket.on("disconnect", async () => {
        const usuario = await usuarioConectado(uid, false);
        console.log(usuario.nombre, "se desconectó");
        this.io.emit("lista-usuarios", await getUsuariosOnline());
      });

      //Obtener Todas las Notificaciones
      socket.on("mis-notificaciones-todas", async (uid) => {
        await getNotificacionesTodas(uid, this.io);
      });

      //Crear Notioficacion enviar-notificacion
      socket.on("enviar-notificacion", async (data) => {
        const resp = await newNotificaciones(data, this.io);
        socket.emit("resp-notifi", resp);
      });

      socket.on("notificacion-leida", async (data) => {
        const resp = await notificacionLeida(data, this.io);
        socket.emit("resp-notifi-leida", resp);
      });

      socket.on("mensaje-personal", async (payload) => {
        const message = await grabarMessage(payload);
        this.io.to(payload.para).emit("mensaje-personal", message);
        this.io.to(payload.de).emit("mensaje-personal", message);
      });

      socket.on("obtener-chat", async (payload) => {
        const chat = await obtenerChat(payload.miId, payload.mensajeDe);
        this.io.to(payload.miId).emit("obtener-chat", chat);
      });
    });
  }
}

module.exports = Sockets;

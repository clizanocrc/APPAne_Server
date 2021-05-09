const { verificarJWT } = require("../helpers/jwt");
const {
  usuarioConectado,
  getUsuariosOnline,
  getNotificacionesTodas,
  newNotificaciones,
  notificacionLeida,
  grabarMessage,
  obtenerChat,
  chatLeido,
  obtenerChatPendiente,
} = require("../controllers");

class Sockets {
  constructor(io) {
    this.io = io;
    this.socketEvents();
  }

  socketEvents() {
    const chatSinLeer = async (destino, io) => {
      const resp = await obtenerChatPendiente(destino);
      io.to(destino).emit("chat-no-leido", resp);
    };

    this.io.on("connection", async (socket) => {
      //Coneccion del Usuario
      const [valido, uid] = verificarJWT(socket.handshake.query["x-token"]);

      if (!valido) {
        console.log("Socket no identificado");
        return socket.disconnect();
      }

      const usuario = await usuarioConectado(uid, true);
      socket.join(uid);
      console.log(usuario.nombre, uid, "se conectó");
      this.io.emit("lista-usuarios", await getUsuariosOnline(uid));
      await getNotificacionesTodas(uid, this.io);

      //Entregar el chat no leído
      await chatSinLeer(uid, this.io);

      // const resp = await obtenerChatPendiente(uid);
      // this.io.to(uid).emit("chat-no-leido", resp);

      //Desconeccion del Usuario
      socket.on("disconnect", async () => {
        const usuario = await usuarioConectado(uid, false);
        console.log(usuario.nombre, "se desconectó");
        this.io.emit("lista-usuarios", await getUsuariosOnline(uid));
      });

      //Obtener Todas las Notificaciones
      socket.on("mis-notificaciones-todas", async (uid) => {
        await getNotificacionesTodas(uid, this.io);
      });

      //Crear Notificacion enviar-notificacion
      socket.on("enviar-notificacion", async (data) => {
        const resp = await newNotificaciones(data, this.io);
        socket.emit("resp-notifi", resp);
      });
      //Marca una notificación como leída
      socket.on("notificacion-leida", async (data) => {
        const resp = await notificacionLeida(data, this.io);
        socket.emit("resp-notifi-leida", resp);
      });

      //Chat

      socket.on("obtener-chat", async (payload) => {
        //Envia el chat de las dos personas involucradas
        const chat = await obtenerChat(payload);
        this.io.to(payload.miId).emit("obtener-chat", chat);
        await chatSinLeer(payload.miId, this.io);
      });

      socket.on("mensaje-personal", async (payload) => {
        //Envia los mensajes entre las personas
        const mensaje = await grabarMessage(payload);
        this.io.to(payload.para).emit("mensaje-personal", mensaje);
        this.io.to(payload.de).emit("mensaje-personal", mensaje);
        await chatSinLeer(payload.para, this.io);
      });

      socket.on("chat-leido", async (payload) => {
        //Marca un mensaje de chat como leído
        const resp = await chatLeido(payload._id);
        this.io.to(payload.para).emit("chat-leido", resp);
        this.io.to(payload.de).emit("chat-leido", resp);
        await chatSinLeer(payload.para, this.io);
      });

      socket.on("chat-no-leido", async (payload) => {
        // Envía los mensajes pendientes
        await chatSinLeer(payload._id, this.io);
      });
    });
  }
}

module.exports = Sockets;

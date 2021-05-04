const { verificarJWT } = require("../helpers/jwt");
const {
  usuarioConectado,
  getUsuariosOnline,
  getNotificacionesTodas,
  newNotificaciones,
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
      //Unir el usuario a una sala de socket
      //Se une a la sala con el mismo id por si se le quiere enviar
      //un mensaje personalizado
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
        await newNotificaciones(data, this.io);
      });

      socket.on("mensaje-to-server", (data) => {
        console.log(data);
        this.io.emit("mensaje-from-server", data);
      });
    });
  }
}

module.exports = Sockets;

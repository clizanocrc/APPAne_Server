const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { dbConnection } = require("../database/configDB");
const Sockets = require("./sockets");

class Server {
  constructor() {
    //Paths del Servidor
    this.paths = {
      blogs: "/api/blogs",
      auth: "/api/auth",
      conyuges: "/api/conyuges",
      diocesis: "/api/diocesis",
      documentos: "/api/documentos",
      matrimonios: "/api/matrimonios",
      parametros: "/api/parametros",
      search: "/api/search",
      uploadsimg: "/api/uploadsimg",
      uploadsfile: "/api/uploadsfile",
      usuarios: "/api/usuarios",
      calendario: "/api/calendario",
    };
    //Inicio de express
    this.app = express();
    //variables
    this.port = process.env.PORT;
    //Servidor
    this.server = http.createServer(this.app);
    //Sockets
    this.io = socketio(this.server, {
      /*Configuraciones de los Sockets */
    });
    //Conectar Base de Datos
    this.databaseConnect();
    //Midelewares: Funciones que agregan funcionalidad al servidor
    this.midelewares();
    //Rutas
    this.routes();
  }

  async databaseConnect() {
    await dbConnection();
  }

  // metodos de los Sockets
  sockets() {
    new Sockets(this.io);
  }

  midelewares() {
    //cors
    this.app.use(cors());
    //parseo y lectura del body
    this.app.use(express.json());
    //Servir la carpeta pública
    this.app.use(express.static("public"));
    //File Upload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    //Rutas
    this.app.use(this.paths.blogs, require("../routes/blogs"));
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.conyuges, require("../routes/conyuges"));
    this.app.use(this.paths.diocesis, require("../routes/diocesis"));
    this.app.use(this.paths.documentos, require("../routes/documentos"));
    this.app.use(this.paths.matrimonios, require("../routes/matrimonios"));
    this.app.use(this.paths.parametros, require("../routes/params"));
    this.app.use(this.paths.search, require("../routes/search"));
    this.app.use(this.paths.uploadsimg, require("../routes/uploadsimg"));
    this.app.use(this.paths.uploadsfile, require("../routes/uploadsfile"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios"));
    this.app.use(this.paths.calendario, require("../routes/calendario"));
    this.app.use(this.paths.blogs, require("../routes/blogs"));
  }

  //Inicia las escuchas del puerto
  startListem() {
    this.sockets();
    this.server.listen(this.port, () => {
      console.log(`Server REST & Sockets run in PORT: ${this.port}`);
    });
  }
}

module.exports = Server;

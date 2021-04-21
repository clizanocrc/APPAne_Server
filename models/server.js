const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { dbConnection } = require("../database/configDB");

class Server {
  constructor() {
    //Inicio de express
    this.app = express();
    //variables
    this.port = process.env.PORT;
    this.paths = {
      _1010: "/api/1010",
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
      events: "/api/events",
    };
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

  //metodos
  routes() {
    //Rutas
    this.app.use(this.paths._1010, require("../routes/1010"));
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
    this.app.use(this.paths.events, require("../routes/events"));
  }

  //Inicia la escucha del puerto
  startListem() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto: ${this.port}`);
    });
  }
}

module.exports = Server;

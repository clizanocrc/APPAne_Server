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
      auth: "/api/auth",
      conyuges: "/api/conyuges",
      diocesis: "/api/diocesis",
      matrimonios: "/api/matrimonios",
      search: "/api/search",
      uploads: "/api/uploads",
      usuarios: "/api/usuarios",
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
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.conyuges, require("../routes/conyuges"));
    this.app.use(this.paths.matrimonios, require("../routes/matrimonios"));
    this.app.use(this.paths.diocesis, require("../routes/diocesis"));
    this.app.use(this.paths.search, require("../routes/search"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios"));
  }

  //Inicia la escucha del puerto
  startListem() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto: ${this.port}`);
    });
  }
}

module.exports = Server;

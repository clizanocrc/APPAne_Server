const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { pathImg } = require("../helpers/paths");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const validasDefecto = ["png", "jpg", "jpeg", "gif", "bmp"];

const subirArchivoClodinary = (
  files,
  extencionesValidas = validasDefecto,
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];
    if (!extencionesValidas.includes(extension)) {
      return reject({
        ok: false,
        msg: "Tipo de archivo no permitido",
        validos: extencionesValidas,
      });
    }

    const { tempFilePath } = archivo;
    cloudinary.uploader.upload(tempFilePath).then().catch();

    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = pathImg(carpeta, nombreTemp);
    archivo.mv(uploadPath, (error) => {
      if (error) {
        console.log(error);
        return reject({
          ok: false,
          msg: "Errores al subir archivo, contactar al Administrador",
          error,
        });
      }
      resolve({
        ok: true,
        msg: "Archivo cargado " + nombreTemp,
        nombre: nombreTemp,
      });
    });
  });
};

const eliminarImgClodinary = async (nombre, carpeta) => {
  //TODO: Borrar Imagen de Cloudinary

  const pathBorrar = pathImg(carpeta, nombre);
  if (fs.existsSync(pathBorrar)) {
    fs.unlinkSync(pathBorrar);
  }
};

module.exports = {
  subirArchivoClodinary,
  eliminarImgClodinary,
};

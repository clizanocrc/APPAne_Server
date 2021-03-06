const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { pathImg } = require("../helpers/paths");

const validasDefecto = ["png", "jpg", "jpeg", "gif", "bmp"];

const subirArchivo = (
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

const eliminarImg = async (nombre, carpeta) => {
  const pathBorrar = pathImg(carpeta, nombre);
  if (fs.existsSync(pathBorrar)) {
    fs.unlinkSync(pathBorrar);
  }
};

module.exports = {
  subirArchivo,
  eliminarImg,
};

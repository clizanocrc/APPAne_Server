const fs = require("fs");
const { request, response } = require("express");

const {
  eliminarImg,
  imgExtensionesValidas,
  pathImg,
  pathImagenDefault,
  retornarModelo,
  subirArchivo,
} = require("../helpers");

const cargarArchivo = async (req = request, res = response) => {
  //para dejar los tipos de archivo por defecto enviar undefine en el arreglo de imagenes permitidas
  const respuesta = await subirArchivo(
    req.files,
    imgExtensionesValidas,
    "textos"
  ).catch((resp) => {
    return res.status(400).json(resp);
  });
  res.status(200).json(respuesta);
};

const actualizarImagen = async (req = request, res = response) => {
  const { coleccion } = req.params;

  let modelo = await retornarModelo(req, res);
  //Limpiar imagenes previas
  if (modelo.img) {
    await eliminarImg(modelo.img, coleccion);
  }
  //para dejar los tipos de archivo por defecto enviar undefine en el arreglo de imagenes permitidas
  const respuesta = await subirArchivo(
    req.files,
    imgExtensionesValidas,
    coleccion
  ).catch((resp) => {
    return res.status(400).json(resp);
  });
  modelo.img = respuesta.nombre;
  modelo.save();
  res.status(200).json(respuesta);
};

const enviarImg = async (req = request, res = response) => {
  const { coleccion } = req.params;
  let modelo = await retornarModelo(req, res);
  if (modelo.img) {
    const pathImagen = pathImg(coleccion, modelo.img);
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }
  res.sendFile(pathImagenDefault());
};
module.exports = { cargarArchivo, actualizarImagen, enviarImg };

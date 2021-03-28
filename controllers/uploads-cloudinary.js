const fs = require("fs");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const {
  imgExtensionesValidas,
  pathImg,
  pathImagenDefault,
  retornarModelo,
  eliminarImgClodinary,
  subirArchivoClodinary,
} = require("../helpers");

const cargarArchivoCloudinary = async (req = request, res = response) => {
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

const actualizarImagenCloudinary = async (req = request, res = response) => {
  let modelo = await retornarModelo(req, res);
  // TODO: Limpiar imagenes previas de Cloudinary
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;
  await modelo.save();

  res.status(200).json({
    ok: true,
    msg: "Archivo subido a Cloudinary",
    modelo,
  });
};

const enviarImgCloudinary = async (req = request, res = response) => {
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
module.exports = {
  cargarArchivoCloudinary,
  actualizarImagenCloudinary,
  enviarImgCloudinary,
};

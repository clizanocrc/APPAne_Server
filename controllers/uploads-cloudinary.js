const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const {
  retornarModelo,
  imgExtensionesValidas,
  fileExtensionesValidas,
  pathCloudinary,
} = require("../helpers");

const actualizarImagenCloudinary = async (req = request, res = response) => {
  console.log("Recibiendo Archivo");
  const { archivo } = req.files;
  const nombreCortado = archivo.name.split(".");
  const extension = nombreCortado[nombreCortado.length - 1].toLowerCase();
  if (!imgExtensionesValidas.includes(extension)) {
    return res.status(400).json({
      ok: false,
      msg: "Tipo de archivo no permitido",
      validos: imgExtensionesValidas,
    });
  }
  let modelo = await retornarModelo(req, res);
  const { coleccion } = req.params;
  if (modelo.images) {
    const nombreArr = modelo.images.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(`${pathCloudinary}/${coleccion}/${public_id}`);
  }
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader
    .upload(tempFilePath, {
      folder: `${pathCloudinary}/${coleccion}`,
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: "Hable con el administrador",
      });
    });
  modelo.images = secure_url;
  await modelo.save();
  res.status(200).json({
    ok: true,
    msg: "Imagen Actualizada",
    modelo,
  });
};

const actualizarFileCloudinary = async (req = request, res = response) => {
  const { archivo } = req.files;
  const nombreCortado = archivo.name.split(".");
  const extension = nombreCortado[nombreCortado.length - 1];
  if (!fileExtensionesValidas.includes(extension)) {
    return res.status(400).json({
      ok: false,
      msg: "Tipo de archivo no permitido",
      validos: fileExtensionesValidas,
    });
  }
  let modelo = await retornarModelo(req, res);
  const { coleccion } = req.params;
  if (modelo.images) {
    const nombreArr = modelo.images.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(`${pathCloudinary}/${coleccion}/${public_id}`);
  }
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader
    .upload(tempFilePath, {
      folder: `${pathCloudinary}/${coleccion}`,
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: "Hable con el administrador",
      });
    });
  modelo.url = secure_url;
  await modelo.save();
  res.status(200).json({
    ok: true,
    msg: "Documento Actualizado",
    modelo,
  });
};

module.exports = {
  actualizarImagenCloudinary,
  actualizarFileCloudinary,
};

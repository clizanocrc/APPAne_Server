const {
  Usuario,
  Role,
  Diocesis,
  Matrimonio,
  Conyuges,
  Documentos,
  Blogentrada,
  Blogcomentario,
} = require("../models");
const { generos, bloques } = require("../search/colecciones");

const validaRol = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol: ${rol}, No es un rol válido`);
  }
};

const existeCorreo = async (correo = "") => {
  const existeCorreo = await Usuario.findOne({ correo });
  if (existeCorreo) {
    throw new Error(`El correo ${correo}, Ya esta registrado`);
  }
};

const existeUsuarioDB = async (correo = "") => {
  const usuario = await Usuario.findOne({ correo });
  if (existeCorreo) {
    return usuario;
  } else {
    return false;
  }
};

const existeUsuarioID = async (id = "") => {
  const existeId = await Usuario.findById(id);
  if (!existeId) {
    throw new Error(`El Usuario no existe, id: ${id}`);
  }
};

const traeUsuarioID = async (id = "") => {
  const usuario = await Usuario.findById(id);
  if (!usuario) {
    throw new Error(`El Usuario no existe, id: ${id}`);
  }
  return usuario;
};

const existeMatrimonioID = async (id = "") => {
  const matrimonioId = await Matrimonio.findById(id);
  if (!matrimonioId) {
    throw new Error(`El Matrimonio No existe, id: ${id}`);
  }
};

const existeDiocesisID = async (id = "") => {
  const diocesisId = await Diocesis.findById(id);
  if (!diocesisId) {
    throw new Error(`La Diócesis no Existe, id: ${id}`);
  }
};

const existeDocumentoID = async (id = "") => {
  const documentoId = await Documentos.findById(id);
  if (!documentoId) {
    throw new Error(`El Documento no Existe, id: ${id}`);
  }
};

// const existe1010ID = async (id = "") => {
//   const _1010Id = await _1010.findById(id);
//   if (!_1010Id) {
//     throw new Error(`El 1010 no Existe, id: ${id}`);
//   }
// };

const existeBlogID = async (id = "") => {
  const blogentrada = await Blogentrada.findById(id);
  if (!blogentrada) {
    throw new Error(`El Blog no Existe, id: ${id}`);
  }
};

const existeBlogCommentID = async (id = "") => {
  const blogcomentario = await Blogcomentario.findById(id);
  if (!blogcomentario) {
    throw new Error(`El Comentario no Existe, id: ${id}`);
  }
};

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  return colecciones.includes(coleccion);
};

const existeEmailConyuge = async (email = "") => {
  if (email.length === 0) {
    return;
  }
  const existeCorreo = await Conyuges.findOne({ email });
  if (existeCorreo) {
    throw new Error(`El correo ${email}, Ya esta registrado`);
  }
  // return existeCorreo;
};

const validaGenero = (genero = "") => {
  permitido = generos.includes(genero);
  if (!permitido) {
    throw new Error(`Genero no permitido, genero: ${genero}`);
  }
  return permitido;
};

const validaBloque = (bloque = "") => {
  permitido = bloques.includes(bloque);
  if (!permitido) {
    throw new Error(`Bloque no permitido, bloque: ${bloque}`);
  }
  return permitido;
};

module.exports = {
  validaRol,
  existeBlogCommentID,
  existeBlogID,
  existeCorreo,
  existeDiocesisID,
  existeDocumentoID,
  existeMatrimonioID,
  existeUsuarioID,
  existeUsuarioDB,
  traeUsuarioID,
  coleccionesPermitidas,
  validaGenero,
  existeEmailConyuge,
  validaBloque,
};

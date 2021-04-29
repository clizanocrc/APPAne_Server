const Server = require("./server");
const Conyuges = require("./conyuges");
const Diocesis = require("./diocesis");
const Documentos = require("./documentos");
const Matrimonio = require("./matrimonio");
const Mensajes = require("./mensajes");
const Param = require("./param");
const Role = require("./role");
const Usuario = require("./usuario");
const Evento = require("./evento");
const Blogentrada = require("./blogEntrada");
const Blogcategoria = require("./blogCategoria");
const Blogcomentario = require("./blogComentario");
const BlogLike = require("./blogLike");

module.exports = {
  Blogentrada,
  Blogcategoria,
  Blogcomentario,
  BlogLike,
  Conyuges,
  Diocesis,
  Documentos,
  Matrimonio,
  Mensajes,
  Param,
  Role,
  Server,
  Usuario,
  Evento,
};

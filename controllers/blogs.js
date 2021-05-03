const { request, response } = require("express");
const moment = require("moment");
const { Blogentrada, BlogLike, Blogcomentario } = require("../models");
const blogComentario = require("../models/blogComentario");
// Blog
const getBlogs = async (req = request, res = response) => {
  const { limite = 1000, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, blogs, comentarios, likes] = await Promise.all([
    Blogentrada.countDocuments(query),
    Blogentrada.find(query)
      .sort({ fechaPubli: -1 })
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre")
      .populate("categoria", "descripcion"),
    Blogcomentario.find(query)
      .sort({ _id: -1 })
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre"),
    BlogLike.find()
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario"),
    // .populate("usuario", "images"),
  ]);
  res.status(200).json({
    ok: true,
    msg: "Lista de Blogs",
    total,
    blogs,
    comentarios,
    likes,
  });
};

const getBlogByID = async (req = request, res = response) => {
  const { id } = req.params;
  const blogLike = await Blogentrada.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "descripcion");
  res.status(200).json({
    ok: true,
    msg: "1010",
    blog: blogLike,
  });
};

const postBlog = async (req = request, res = response) => {
  const { estado, usuario, titulo, ...body } = req.body;
  const blogLike = await Blogentrada.findOne({ titulo });
  if (blogLike) {
    return res.status(400).json({
      ok: false,
      msg: `Blog ${titulo} ya existe`,
    });
  }
  const data = {
    ...body,
    titulo,
    usuario: req.usuario._id,
  };

  const blogentrada = new Blogentrada(data);
  blogentrada.fechaPubli = moment();
  await blogentrada.save();
  return res.status(201).json({
    ok: true,
    msg: "Blog Creado",
    blog: blogentrada,
  });
};

const putBlog = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, titulo, ...data } = req.body;

  const blogentradaDB = await Blogentrada.findOne({ titulo });
  if (blogentradaDB && blogentradaDB.id !== id) {
    return res.status(400).json({
      ok: false,
      msg: `Blog ${titulo} ya existe`,
    });
  }

  data.usuario = req.usuario._id;
  const blogentrada = await Blogentrada.findByIdAndUpdate(id, data, {
    new: true,
  });
  res.status(200).json({
    ok: true,
    msg: "Blog actualizado",
    blog: blogentrada,
  });
};

const deleteBlog = async (req = request, res = response) => {
  const { id } = req.params;
  const blogentrada = await Blogentrada.findByIdAndUpdate(
    id,
    {
      estado: false,
      usuario: req.usuario._id,
    },
    { new: true }
  );

  res.status(200).json({
    ok: true,
    msg: "BLog Eliminado",
    blog: blogentrada,
  });
};
// Likers
const postLike = async (req = request, res = response) => {
  const { limite = 10000, desde = 0 } = req.query;
  const { id } = req.params;
  const data = {
    blogentrada: id,
    usuario: req.usuario._id,
  };
  const blogLike = await BlogLike.findOne(data);
  if (!blogLike) {
    const bloglike = new BlogLike(data);
    await bloglike.save();
    const blogentrada = await Blogentrada.findById(id)
      .populate("usuario", "nombre")
      .populate("categoria", "descripcion");
    const votos = blogentrada.votos + 1;
    blogentrada.votos = votos;
    await blogentrada.save();

    likes = await BlogLike.find().populate("usuario");

    res.status(200).json({
      ok: true,
      msg: "Que bueno que te gustó",
      data: blogentrada,
      likes,
    });
  } else {
    await BlogLike.findByIdAndDelete(blogLike.id);
    const blogentrada = await Blogentrada.findById(id)
      .populate("usuario")
      .populate("categoria", "descripcion");
    if (blogentrada.votos > 0) {
      const votos = blogentrada.votos - 1;
      blogentrada.votos = votos;
      await blogentrada.save();
    }

    likes = await BlogLike.find().populate("usuario");

    res.status(200).json({
      ok: true,
      msg: "Que lástima que no te gusto",
      data: blogentrada,
      likes,
    });
  }
};
// Comentarios
const postcomentario = async (req = request, res = response) => {
  const { limite = 1000, desde = 0 } = req.query;
  const { id } = req.params;
  const { comentario } = req.body;

  const data = {
    blogentrada: id,
    comentario,
    usuario: req.usuario._id,
  };

  const blogcomentario = new Blogcomentario(data);
  await blogcomentario.save();
  const comentarios = await Blogcomentario.find()
    .sort({ _id: -1 })
    .skip(Number(desde))
    .limit(Number(limite))
    .populate("usuario", "nombre");

  return res.status(201).json({
    ok: true,
    msg: "Gracias por sus comentarios",
    comentarios: comentarios,
  });
};

const putComentario = async (req = request, res = response) => {
  const { limite = 1000, desde = 0 } = req.query;
  const query = { estado: true };
  const { id } = req.params;
  const { comentario, blogentrada } = req.body;
  const comentarioDB = await Blogcomentario.findById(id);

  if (!comentarioDB) {
    return res.status(400).json({
      ok: false,
      msg: `Comentario no Existe`,
    });
  }
  const data = { comentario, blogentrada, usuario: req.usuario._id };
  await Blogcomentario.findByIdAndUpdate(id, data, {
    new: true,
  });
  const comentarios = await Blogcomentario.find(query)
    .sort({ _id: -1 })
    .skip(Number(desde))
    .limit(Number(limite))
    .populate("usuario", "nombre");

  return res.status(201).json({
    ok: true,
    msg: "Comentario Actualizado",
    comentarios: comentarios,
  });
};

const deleteComentario = async (req = request, res = response) => {
  const { limite = 1000, desde = 0 } = req.query;
  const query = { estado: true };
  const { id } = req.params;
  const blogcomentario = await blogComentario.findByIdAndUpdate(
    id,
    {
      estado: false,
      usuario: req.usuario._id,
    },
    { new: true }
  );
  const comentarios = await Blogcomentario.find(query)
    .sort({ _id: -1 })
    .skip(Number(desde))
    .limit(Number(limite))
    .populate("usuario", "nombre");
  res.status(200).json({
    ok: true,
    msg: "Comentario Eliminado",
    comentarios: comentarios,
  });
};

module.exports = {
  getBlogs,
  getBlogByID,
  postBlog,
  putBlog,
  deleteBlog,
  postLike,
  postcomentario,
  putComentario,
  deleteComentario,
};
1010;

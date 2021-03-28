const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");

const searchUsuarios = async (termino = "", res = response) => {
  const DBId = ObjectId.isValid(termino);
  if (DBId) {
    const [total, usuario] = await Promise.all([
      Usuario.countDocuments({ _id: termino }),
      Usuario.findById(termino),
    ]);
    return res.status(200).json({
      total,
      results: usuario ? [usuario] : [],
    });
  }
  //Hacerlo incensible a las mayusculas y minusculas
  const regex = new RegExp(termino, "i");
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments({
      $or: [{ nombre: regex }, { correo: regex }],
      $and: [{ estado: true }],
    }),
    Usuario.find({
      $or: [{ nombre: regex }, { correo: regex }],
      $and: [{ estado: true }],
    }),
  ]);
  res.status(200).json({
    total,
    results: usuarios,
  });
};
const searchCategorias = async (termino = "", res = response) => {
  const DBId = ObjectId.isValid(termino);
  if (DBId) {
    const [total, categoria] = await Promise.all([
      Categoria.countDocuments({ _id: termino }),
      Categoria.findById(termino),
    ]);
    return res.status(200).json({
      total,
      results: categoria ? [categoria] : [],
    });
  }
  //Hacerlo incensible a las mayusculas y minusculas
  const regex = new RegExp(termino, "i");
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments({ nombre: regex, estado: true }),
    Categoria.find({ nombre: regex, estado: true }),
  ]);
  res.status(200).json({
    total,
    results: categorias,
  });
};
const searchProductos = async (termino = "", res = response) => {
  const DBId = ObjectId.isValid(termino);
  if (DBId) {
    const [total, producto] = await Promise.all([
      Producto.countDocuments({ _id: termino }),
      Producto.findById(termino)
        .populate("categoria", "nombre")
        .populate("usuario", "nombre"),
    ]);
    return res.status(200).json({
      total,
      results: producto ? [producto] : [],
    });
  }
  //Hacerlo incensible a las mayusculas y minusculas
  const regex = new RegExp(termino, "i");
  const [total, productos] = await Promise.all([
    Producto.countDocuments({
      $or: [{ nombre: regex }, { descripcion: regex }],
      $and: [{ estado: true }],
    }),
    Producto.find({
      $or: [{ nombre: regex }, { descripcion: regex }],
      $and: [{ estado: true }],
    })
      .populate("categoria", "nombre")
      .populate("usuario", "nombre"),
  ]);
  res.status(200).json({
    total,
    results: productos,
  });
};
const searchProdxCateID = async (termino = "", res = response) => {
  const DBId = ObjectId.isValid(termino);
  if (DBId) {
    const [total, productos] = await Promise.all([
      Producto.countDocuments({ categoria: ObjectId(termino) }),
      Producto.find({ categoria: ObjectId(termino) })
        .populate("categoria", "nombre")
        .populate("usuario", "nombre"),
    ]);
    return res.status(200).json({
      total,
      results: productos ? [productos] : [],
    });
  }
  res.status(400).json({
    results: [],
  });
};
const searchDefault = (coleccion, res = response) => {
  res.status(500).json({
    ok: false,
    msg: "Búsqueda sin implementación, hable con el administrador",
    coleccion,
  });
};
const searchError = (coleccionesSearch, coleccion, res = response) => {
  res.status(400).json({
    ok: false,
    msg: `Colección ${coleccion} no existe`,
    permitidas: coleccionesSearch,
  });
};

module.exports = {
  searchUsuarios,
  searchCategorias,
  searchProductos,
  searchProdxCateID,
  searchDefault,
  searchError,
};

//{categoria : ObjectId('604fbb765905ce4a18144561')  }

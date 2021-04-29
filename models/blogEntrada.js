const { Schema, model } = require("mongoose");

const BlogentradaSchema = Schema({
  titulo: {
    type: String,
    required: [true, "El título es obligatorio"],
  },
  contenidocorto: {
    type: String,
    default: "",
  },
  contenido: {
    type: String,
    default: "",
  },
  images: {
    type: String,
    default: "",
  },
  estado: {
    type: Boolean,
    default: true,
  },
  votos: {
    type: Number,
    default: 0,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Blogcategoria",
    required: true,
  },
  fechaPubli: {
    type: Date,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

BlogentradaSchema.methods.toJSON = function () {
  const { __v, _id, estado, ...blogentradas } = this.toObject();
  blogentradas.id = _id;
  return blogentradas;
};

module.exports = model("Blogentrada", BlogentradaSchema);

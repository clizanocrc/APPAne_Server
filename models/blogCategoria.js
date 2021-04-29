const { Schema, model } = require("mongoose");

const BlogcategoriaSchema = Schema({
  categoria: {
    type: String,
    required: [true, "La Categoría es obligatorio"],
  },
  descripcion: {
    type: String,
    default: "",
  },
  estado: {
    type: Boolean,
    default: true,
    required: [true, "El estado es requerido"],
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

BlogcategoriaSchema.methods.toJSON = function () {
  const { __v, _id, estado, ...blogcategoria } = this.toObject();
  blogcategoria.id = _id;
  return blogcategoria;
};

module.exports = model("Blogcategoria", BlogcategoriaSchema);

const { Schema, model } = require("mongoose");

const BlogcomentarioSchema = Schema({
  comentario: {
    type: String,
  },
  blogentrada: {
    type: Schema.Types.ObjectId,
    ref: "Blogentrada",
    required: true,
  },
  estado: {
    type: Boolean,
    default: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

BlogcomentarioSchema.methods.toJSON = function () {
  const { __v, _id, estado, ...blogcomentario } = this.toObject();
  blogcomentario.id = _id;
  return blogcomentario;
};

module.exports = model("Blogcomentario", BlogcomentarioSchema);

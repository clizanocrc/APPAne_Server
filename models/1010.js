const { Schema, model } = require("mongoose");

const _1010Schema = Schema({
  titulo: {
    type: String,
    required: [true, "El título es obligatorio"],
  },
  datePubli: {
    type: Date,
    required: [true, "La Fecha de publicación es obligatoria"],
  },
  images: {
    type: String,
    default: "",
  },
  mensaje: {
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

_1010Schema.methods.toJSON = function () {
  const { __v, _id, estado, ..._1010 } = this.toObject();
  _1010.id = _id;
  return _1010;
};

module.exports = model("_1010", _1010Schema);

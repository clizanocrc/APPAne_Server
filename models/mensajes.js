const { Schema, model } = require("mongoose");

const MensajesSchema = Schema({
  titulo: {
    type: String,
    required: [true, "El título es obligatorio"],
  },
  mensaje: {
    type: String,
    default: "",
  },
  de: {
    type: String,
    default: "",
  },
  para: {
    type: String,
    default: "",
  },
  images: {
    type: String,
    default: "",
  },
  url: {
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

MensajesSchema.methods.toJSON = function () {
  const { __v, _id, estado, ...mensajes } = this.toObject();
  mensajes.id = _id;
  return mensajes;
};

module.exports = model("Mensajes", MensajesSchema);

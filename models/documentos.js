const { Schema, model } = require("mongoose");

const DocumentosSchema = Schema({
  titulo: {
    type: String,
    required: [true, "El título es obligatorio"],
  },
  mensaje: {
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

DocumentosSchema.methods.toJSON = function () {
  const { __v, _id, estado, ...documentos } = this.toObject();
  documentos.id = _id;
  return documentos;
};

module.exports = model("Documentos", DocumentosSchema);

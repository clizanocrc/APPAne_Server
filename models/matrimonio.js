const { Schema, model } = require("mongoose");

const MatrimonioSchema = Schema({
  matrimonio: {
    type: String,
    required: [true, "El nombre del Matrimonio es obligatorio"],
  },
  telefono: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  images: {
    type: String,
    default: {},
  },
  fechaMatrimonio: {
    type: Date,
    default: null,
  },
  direccion: {
    type: String,
    default: "",
  },
  generalidades: {
    type: String,
    default: "",
  },
  activo: {
    type: Boolean,
    default: true,
  },
  bloque: {
    type: String,
    default: "Primero",
    emun: ["Primero", "Segundo", "Tercero"],
  },
  diocesis: {
    type: Schema.Types.ObjectId,
    ref: "Diocesis",
    required: true,
  },
  esMatrimonio: {
    type: Boolean,
    default: true,
  },
  esposo: {
    type: Schema.Types.ObjectId,
    ref: "Conyuge",
    required: true,
  },
  esposa: {
    type: Schema.Types.ObjectId,
    ref: "Conyuge",
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

MatrimonioSchema.methods.toJSON = function () {
  const { __v, _id, estado, ...matrimonio } = this.toObject();
  matrimonio.id = _id;
  return matrimonio;
};

module.exports = model("Matrimonio", MatrimonioSchema);

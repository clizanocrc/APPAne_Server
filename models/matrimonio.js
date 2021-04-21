const { Schema, model } = require("mongoose");

const MatrimonioSchema = Schema({
  nombrematrimonio: {
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
    default: "",
  },
  fechaMatrimonio: {
    type: Date,
    default: null,
  },
  fechaOrdenacion: {
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
    emun: ["Primero", "Segundo", "Tercero", "Honorario"],
  },
  esMatrimonio: {
    type: Boolean,
    default: true,
  },
  diocesis: {
    type: Schema.Types.ObjectId,
    ref: "Diocesis",
    required: true,
  },
  esposo: {
    type: Schema.Types.ObjectId,
    ref: "Conyuges",
    // required: true,
  },
  esposa: {
    type: Schema.Types.ObjectId,
    ref: "Conyuges",
    // required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

MatrimonioSchema.methods.toJSON = function () {
  const { __v, _id, estado, diocesis, ...matrimonio } = this.toObject();
  const { nombre, _id: idDiocesis } = diocesis;
  matrimonio.diocesis = nombre;
  matrimonio.diocesisid = idDiocesis;
  matrimonio.id = _id;
  return matrimonio;
};

// MatrimonioSchema.methods.toJSON = function () {
//   const { __v, _id, estado, ...matrimonio } = this.toObject();
//   matrimonio.id = _id;
//   return matrimonio;
// };

module.exports = model("Matrimonio", MatrimonioSchema);

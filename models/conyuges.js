const { Schema, model } = require("mongoose");

const ConyugesSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  apellido: {
    type: String,
    required: [true, "El apellido es requerido"],
  },
  genero: {
    type: String,
    required: [true, "El género es requerido"],
  },
  telefono: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  fechaNacimiento: {
    type: Date,
    default: null,
  },
  idMatrimonio: {
    type: String,
    default: "",
  },
  estado: {
    type: Boolean,
    default: true,
    required: [true, "El estado del cónyuge es requerido"],
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

ConyugesSchema.methods.toJSON = function () {
  const { __v, _id, ...conyuges } = this.toObject();
  conyuges.id = _id;
  return conyuges;
};

module.exports = model("Conyuges", ConyugesSchema);

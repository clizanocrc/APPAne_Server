const { Schema, model } = require("mongoose");

const DiocesisSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre de la diócesis es obligatorio"],
    unique: [true, "El nombre de la diócesis es único"],
  },
  estado: {
    type: Boolean,
    default: true,
    required: [true, "El estado de la diócesis es requerido"],
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

DiocesisSchema.methods.toJSON = function () {
  const { __v, _id, estado, ...diocesis } = this.toObject();
  diocesis.id = _id;
  return diocesis;
};

module.exports = model("Diocesis", DiocesisSchema);

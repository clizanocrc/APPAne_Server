const { Schema, model } = require("mongoose");

const NotificacionesSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  para: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  de: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  fechaenviado: {
    type: Date,
    required: true,
  },
  leido: {
    type: Boolean,
    default: false,
  },
  fechaleido: {
    type: Date,
    required: false,
  },
});

//Sustituir los nombres de campos que nos devuelve Mongo
NotificacionesSchema.method("toJSON", function () {
  const { __v, _id, ...notificacion } = this.toObject();
  notificacion.id = _id;
  return notificacion;
});

module.exports = model("Notificaciones", NotificacionesSchema);

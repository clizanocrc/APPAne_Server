const { Schema, model } = require("mongoose");

const MensajeSchema = Schema(
  {
    de: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    para: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    mensaje: {
      type: String,
      required: true,
    },
    leido: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

MensajeSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Mensaje", MensajeSchema);

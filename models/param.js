const { Schema, model } = require("mongoose");

const ParamsSchema = Schema({
  sinpemovil: {
    type: String,
    default: "",
  },
  sinpemovilFIKolbi: {
    type: String,
    default: "",
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

ParamsSchema.methods.toJSON = function () {
  const { __v, _id, ...param } = this.toObject();
  param.id = _id;
  return param;
};

module.exports = model("Param", ParamsSchema);

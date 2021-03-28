const { Schema, model } = require("mongoose");

const UsuarioShema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "El password es obligatorio"],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: [true, "El rol es obligatorio"],
    default: "USER_ROLE",
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

UsuarioShema.methods.toJSON = function () {
  const { __v, _id, password, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

module.exports = model("Usuario", UsuarioShema);

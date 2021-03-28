const bcryptjs = require("bcryptjs");
const saltosCryp = 10;

// Genera contraseña incriptada
const encriptaPassword = (password) => {
  const salt = bcryptjs.genSaltSync(saltosCryp);
  return bcryptjs.hashSync(password, salt);
};

// Valida un password encriptado contra otro sin encriptar
const validaPassword = (password1, password2) => {
  return bcryptjs.compareSync(password1, password2);
};

module.exports = { encriptaPassword, validaPassword };

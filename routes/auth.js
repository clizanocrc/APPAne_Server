const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares");
const { login, googleSingIn } = require("../controllers");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo no es válido").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

// router.post(
//   "/google",
//   [
//     check("id_token", "El id_token de Google es necesario").not().isEmpty(),
//     validarCampos,
//   ],
//   googleSingIn
// );

module.exports = router;

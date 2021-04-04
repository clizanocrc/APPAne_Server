const { Router } = require("express");
const { check } = require("express-validator");
const { actualizarImagenCloudinary } = require("../controllers");
const { coleccionesPermitidas } = require("../helpers");

const {
  validarJWT,
  validarArchivos,
  validarCampos,
} = require("../middlewares");
const { colecciones } = require("../search/colecciones");

const router = Router();

router.put(
  "/:coleccion/:id",
  [
    validarJWT,
    validarArchivos,
    check("coleccion", "No es una colección válido").custom((c) =>
      coleccionesPermitidas(c, colecciones)
    ),
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  actualizarImagenCloudinary
);

module.exports = router;

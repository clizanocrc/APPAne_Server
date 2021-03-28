const { Router } = require("express");
const { check } = require("express-validator");
const {
  cargarArchivo,
  // actualizarImagen,
  enviarImg,
  actualizarImagenCloudinary,
} = require("../controllers");
const { coleccionesPermitidas } = require("../helpers");

const {
  validarJWT,
  validarArchivos,
  validarCampos,
} = require("../middlewares");

const router = Router();

router.post("/", [validarJWT, validarArchivos, validarCampos], cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarJWT,
    validarArchivos,
    check("coleccion", "No es una colección válido").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  // actualizarImagen
  actualizarImagenCloudinary
);

router.get(
  "/:coleccion/:id",
  [
    check("coleccion", "No es una colección válido").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  enviarImg
);

module.exports = router;

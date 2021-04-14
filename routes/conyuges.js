const { Router } = require("express");
const { check } = require("express-validator");
const {
  getConyuges,
  getConyugebyID,
  postConyuge,
  putConyuge,
  deleteConyuge,
} = require("../controllers");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const { validaGenero, existeEmailConyuge } = require("../helpers");

const router = Router();

router.get("/", [validarJWT, validarCampos], getConyuges);

router.get(
  "/:id",
  [validarJWT, check("id", "No es un ID válido").isMongoId(), validarCampos],
  getConyugebyID
);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    // check("apellido", "El apellido es obligatorio").not().isEmpty(),
    // check("email", "El email es obligatorio").not().isEmpty(),
    // check("email", "El email debe ser válido").isEmail(),
    check("email").custom(existeEmailConyuge),
    check("genero", "El genero es obligatorio").not().isEmpty(),
    check("genero").custom(validaGenero),
    validarCampos,
  ],
  postConyuge
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  putConyuge
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  deleteConyuge
);

module.exports = router;

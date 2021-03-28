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

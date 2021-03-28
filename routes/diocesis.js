const { Router } = require("express");
const { check } = require("express-validator");
const {
  getDiocesis,
  getDiocesisobyID,
  postDiocesis,
  putDiocesis,
  deleteDiocesis,
} = require("../controllers");
const { existeDiocesisID } = require("../helpers");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

router.get("/", [validarJWT, validarCampos], getDiocesis);

router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeDiocesisID),
    validarCampos,
  ],
  getDiocesisobyID
);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  postDiocesis
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeDiocesisID),
    validarCampos,
  ],
  putDiocesis
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeDiocesisID),
    validarCampos,
  ],
  deleteDiocesis
);

module.exports = router;

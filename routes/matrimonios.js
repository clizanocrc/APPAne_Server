const { Router } = require("express");
const { check } = require("express-validator");
const {
  getMatrimonios,
  getMatrimoniobyID,
  postMatrimonio,
  putMatrimonio,
  deleteMatrimonio,
} = require("../controllers");
const { existeMatrimonioID } = require("../helpers");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

router.get("/", [validarJWT, validarCampos], getMatrimonios);

router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeMatrimonioID),
    validarCampos,
  ],
  getMatrimoniobyID
);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  postMatrimonio
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeMatrimonioID),
    validarCampos,
  ],
  putMatrimonio
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeMatrimonioID),
    validarCampos,
  ],
  deleteMatrimonio
);

module.exports = router;

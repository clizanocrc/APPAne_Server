const { Router } = require("express");
const { check } = require("express-validator");
const {
  getMatrimonios,
  getMatrimoniobyID,
  postMatrimonio,
  putMatrimonio,
  deleteMatrimonio,
} = require("../controllers");
const { existeMatrimonioID, validaBloque } = require("../helpers");

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
    check("nombrematrimonio", "El nombre del matrimonio es obligatorio")
      .not()
      .isEmpty(),
    check("esposa", "La dato de la esposa es Obligatorio").not().isEmpty(),
    check("esposa", "No es un ID válido").isMongoId(),
    check("esposo", "La dato del esposo es Obligatorio").not().isEmpty(),
    check("esposo", "No es un ID válido").isMongoId(),
    check("diocesis", "La diócesis es obligatoria").not().isEmpty(),
    check("diocesis", "No es un ID válido").isMongoId(),
    check("bloque").custom(validaBloque),
    validarCampos,
  ],
  postMatrimonio
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombrematrimonio", "El nombre es obligatorio").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeMatrimonioID),
    check("diocesis", "La diócesis es obligatoria").not().isEmpty(),
    check("diocesis", "No es un ID válido").isMongoId(),
    check("bloque").custom(validaBloque),
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

/*
    Rutas de Matrimonios / matrimonios
    host + /api/matrimonios
*/

const { Router } = require("express");
const { check } = require("express-validator");
const {
  getDocumentos,
  getDocumentoByID,
  postDocumento,
  putDocumento,
  deleteDocumento,
} = require("../controllers");
const { existeDocumentoID } = require("../helpers");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

router.get("/", [validarJWT, validarCampos], getDocumentos);

router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeDocumentoID),
    validarCampos,
  ],
  getDocumentoByID
);

router.post(
  "/",
  [
    validarJWT,
    check("titulo", "El título es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  postDocumento
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeDocumentoID),
    validarCampos,
  ],
  putDocumento
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeDocumentoID),
    validarCampos,
  ],
  deleteDocumento
);

module.exports = router;

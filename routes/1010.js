const { Router } = require("express");
const { check } = require("express-validator");
const {
  get1010,
  get1010ByID,
  post1010,
  put1010,
  delete1010,
} = require("../controllers");
const { existe1010ID } = require("../helpers");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

router.get("/", [validarJWT, validarCampos], get1010);

router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existe1010ID),
    validarCampos,
  ],
  get1010ByID
);

router.post(
  "/",
  [
    validarJWT,
    check("titulo", "El título es obligatorio").not().isEmpty(),
    check("datePubli", "La Fecha de publicación es requerida").not().isEmpty(),
    validarCampos,
  ],
  post1010
);

router.put(
  "/:id",
  [
    validarJWT,
    // check("titulo", "El título es obligatorio").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existe1010ID),
    validarCampos,
  ],
  put1010
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existe1010ID),
    validarCampos,
  ],
  delete1010
);

module.exports = router;

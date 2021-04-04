const { Router } = require("express");
const { check } = require("express-validator");
const { getParam, postParams, putParams } = require("../controllers");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

router.get("/", [validarJWT, validarCampos], getParam);

router.post("/", [validarJWT, validarCampos], postParams);

router.put(
  "/:id",
  [validarJWT, check("id", "No es un ID válido").isMongoId(), validarCampos],
  putParams
);

module.exports = router;

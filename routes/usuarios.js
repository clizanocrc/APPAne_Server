const { Router } = require("express");
const { check } = require("express-validator");

const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole,
} = require("../middlewares");

const {
  getUsuarios,
  postUsuarios,
  putUsuarios,
  deleteUsuarios,
  deletePermUsuarios,
  patchUsuarios,
  patchUsuariosPass,
} = require("../controllers");

const { validaRol, existeCorreo, existeUsuarioID } = require("../helpers");

const router = Router();

//Todas tienen que pasar por la validación de JWT
// router.use(validarJWT);

router.get("/", getUsuarios);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe tener más de 6 caracteres").isLength({
      min: 6,
    }),
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom(existeCorreo),
    check("rol").custom(validaRol),
    validarCampos,
  ],
  postUsuarios
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioID),
    check("rol").custom(validaRol),
    validarCampos,
  ],
  putUsuarios
);

router.delete(
  "/:id",
  [
    validarJWT,
    //Primero valida que se ADMIN y luego que el rol este entre los especificados
    esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioID),
    validarCampos,
  ],
  deleteUsuarios
);

router.delete(
  "/perm/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioID),
    validarCampos,
  ],
  deletePermUsuarios
);

router.patch(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioID),
    check("correo", "El correo no es válido").isEmail(),
    validarCampos,
  ],
  patchUsuarios
);

router.patch(
  "/pass/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioID),
    check(
      "passNew",
      "El nuevo password debe tener más de 6 caracteres"
    ).isLength({
      min: 6,
    }),
    validarCampos,
  ],
  patchUsuariosPass
);

module.exports = router;

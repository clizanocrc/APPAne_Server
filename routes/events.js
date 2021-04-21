/*
    Rutas de Eventos / events
    host + /api/events
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { isDate } = require("../helpers/isDate");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getEventos,
  newEvento,
  updateEvento,
  deleteEvento,
} = require("../controllers/events");

const router = Router();

//Todas tienen que pasar por la validación de JWT

//Obtener Eventos
router.get("/", [validarJWT, validarCampos], getEventos);

//Crear un nuevo Evento
router.post(
  "/",
  [
    validarJWT,
    check("title", "El titulo es requerido").not().isEmpty(),
    check("start", "Fecha de Inicio es requerida").custom(isDate),
    check("end", "Fecha de Finalización es requerida").custom(isDate),
    validarCampos,
  ],
  newEvento
);

//Actualizar un nuevo Evento
router.put("/:id", [validarJWT, validarCampos], updateEvento);

//Eliminar Evento
router.delete("/:id", [validarJWT, validarCampos], deleteEvento);

module.exports = router;

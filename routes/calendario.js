/*
    Rutas de Eventos / events
    host + /api/events
*/

const { Router } = require("express");
const { check } = require("express-validator");
const {
  getEventos,
  newEvento,
  updateEvento,
  deleteEvento,
} = require("../controllers");

const { isDate } = require("../helpers");
const { validarJWT, validarCampos } = require("../middlewares");

const router = Router();

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

/*
    Rutas de Eventos / events
    host + /api/events
*/

const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT, validarCampos } = require("../middlewares");

const {
  getEventos,
  newEvento,
  updateEvento,
  deleteEvento,
} = require("../controllers");

const { isDate } = require("../helpers");

const router = Router();

router.use(validarJWT);

//Obtener Eventos
router.get("/", getEventos);

//Crear un nuevo Evento
router.post(
  "/",
  [
    check("title", "El titulo es requerido").not().isEmpty(),
    check("start", "Fecha de Inicio es requerida").custom(isDate),
    check("end", "Fecha de Finalización es requerida").custom(isDate),
    validarCampos,
  ],
  newEvento
);

//Actualizar un nuevo Evento
router.put("/:id", updateEvento);

//Eliminar Evento
router.delete("/:id", deleteEvento);

module.exports = router;

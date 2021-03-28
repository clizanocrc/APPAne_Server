const { Router } = require("express");
const { search } = require("../search/search");

const router = Router();

router.get("/:coleccion/:termino", search);

module.exports = router;

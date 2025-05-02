const RecalculateController = require("./recalculate.controller");

const router = require("express").Router();

router.post("/recalculate", RecalculateController);

module.exports = router;

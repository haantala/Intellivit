const seedingController = require("./seeding.controller");

const router = require("express").Router();

router.post("/seeding", seedingController);

module.exports = router;

const LeaderboardController = require("./leaderBoard.controller");

const router = require("express").Router();

router.post("/leaderboard", LeaderboardController);

module.exports = router;

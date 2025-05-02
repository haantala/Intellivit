const express = require("express");
const cors = require("cors");
const sequelize = require("./database");
const bodyParser = require("body-parser");
const { PORT, NODE_ENV } = require("./config");
const app = express();
const env = NODE_ENV;
const fileupload = require("express-fileupload");
sequelize.sync();
app.use(cors());
app.use(express.json());
app.use(fileupload());
app.use(express.static("files"));

app.use(bodyParser.json({ limit: "1024mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "2048mb",
    extended: true,
    parameterLimit: 102400000,
  })
);

// Importing routes
const routes = [
  require("./module/seeding/seeding.routes"),
  require("./module/recalculate/recalculate.routes"),
  require("./module/leaderboard/leaderboard.routes"),
];

routes.forEach((route) => app.use(route));

const server = app.listen(PORT, function () {
  console.log("=================================");
  console.log(`========== ENV: ${env} ===========`);
  console.log(`🚀 App listening on the port ${PORT}`);
  console.log("=================================");
});

const sequelize = require("../database"); // Importing database connection
const ActivityModel = require("./activity.model");
const Leaderboard = require("./leaderboard.model");
const User = require("./user.model");

module.exports = {
  Sequelize: sequelize.constructor,
  sequelize,
  Leaderboard,
  ActivityModel,
  User,
};

// Define associations
User.hasMany(ActivityModel, { foreignKey: "user_id" });
ActivityModel.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(Leaderboard, { foreignKey: "user_id" });
Leaderboard.belongsTo(User, { foreignKey: "user_id" });

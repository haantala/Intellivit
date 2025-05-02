const { DataTypes } = require("@sequelize/core");
const sequelize = require("../database");
const User = require("./user.model");

// Define the User model (table)
const Leaderboard = sequelize.define(
  "Leaderboard",
  {
    leader_board_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    total_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 20, // Each activity is worth 20 points
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "leaderboard",
  }
);

module.exports = Leaderboard;

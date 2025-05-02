const db = require("../../models");
const sequelize = db.sequelize; // Use the Sequelize instance from your models

const Leaderboard = db.Leaderboard;
const Activity = db.ActivityModel;

module.exports = async function RecalculateController(req, res) {
  try {
    // Calculate total points for each user
    const userPoints = await Activity.findAll({
      attributes: [
        "user_id",
        [sequelize.fn("SUM", sequelize.col("points")), "total_points"],
      ],
      group: ["user_id"],
      order: [[sequelize.literal("total_points"), "DESC"]],
      raw: true,
    });

    // Clear existing leaderboard
    await Leaderboard.destroy({ where: {} });

    // Assign ranks (handling ties)
    let currentRank = 1;
    let previousPoints = null;
    const insertData = [];

    for (let i = 0; i < userPoints.length; i++) {
      const { user_id, total_points } = userPoints[i];

      if (previousPoints !== null && previousPoints !== total_points) {
        currentRank = i + 1;
      }

      insertData.push({
        user_id,
        total_points,
        rank: currentRank,
      });

      previousPoints = total_points;
    }

    // Bulk insert new leaderboard data
    await Leaderboard.bulkCreate(insertData);

    return res.status(200).json({
      success: true,
      message: "Leaderboard recalculated successfully",
    });
  } catch (error) {
    console.error("Error recalculating leaderboard:", error);
    return res.status(500).json({
      error: "Failed to recalculate leaderboard",
    });
  }
};

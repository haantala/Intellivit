const Op = require("sequelize").Op;
const Leaderboard = require("../../models/leaderboard.model");
const User = require("../../models/user.model");

module.exports = async function LeaderboardController(req, res) {
  const filter = req.body.period || "all";
  const userId = req.body.searchId;

  let dateFilter = {};
  const now = new Date();

  if (filter === "day") {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    dateFilter = {
      timestamp: {
        [Op.gte]: today,
        [Op.lt]: tomorrow,
      },
    };
  } else if (filter === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    dateFilter = {
      timestamp: {
        [Op.gte]: start,
        [Op.lt]: end,
      },
    };
  } else if (filter === "year") {
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);

    dateFilter = {
      timestamp: {
        [Op.gte]: start,
        [Op.lt]: end,
      },
    };
  }

  try {
    let leaderboardData;

    if (userId) {
      const userLeaderboard = await Leaderboard.findOne({
        where: { user_id: userId },
        include: [{ model: User, attributes: ["user_id", "full_name"] }],
      });

      if (!userLeaderboard) {
        return res.status(404).json({ error: "User not found" });
      }

      const others = await Leaderboard.findAll({
        where: { user_id: { [Op.ne]: userId } },
        include: [{ model: User, attributes: ["user_id", "full_name"] }],
        order: [
          ["total_points", "DESC"],
          ["user_id", "ASC"],
        ],
      });

      leaderboardData = [userLeaderboard, ...others];
    } else {
      leaderboardData = await Leaderboard.findAll({
        include: [{ model: User, attributes: ["user_id", "full_name"] }],
        order: [
          ["total_points", "DESC"],
          ["user_id", "ASC"],
        ],
      });
    }

    return res.json({ leaderboard: leaderboardData });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ error: "Failed to fetch leaderboard data" });
  }
};

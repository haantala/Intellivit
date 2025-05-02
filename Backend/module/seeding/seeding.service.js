const { User, ActivityModel, Leaderboard } = require("../../models");

// Sample user names
const userNames = [
  "John Smith",
  "Emma Johnson",
  "Michael Williams",
  "Olivia Brown",
  "William Jones",
  "Sophia Miller",
  "James Davis",
  "Isabella Garcia",
  "Alexander Rodriguez",
  "Mia Martinez",
  "Ethan Wilson",
  "Charlotte Anderson",
  "Daniel Taylor",
  "Amelia Thomas",
  "Matthew Jackson",
  "Harper White",
  "David Harris",
  "Evelyn Martin",
  "Joseph Thompson",
  "Abigail Moore",
];

// Function to generate random number of activities (1-20) for a user
const getRandomActivitiesCount = () => Math.floor(Math.random() * 20) + 1;
// Seed function
module.exports = async function seedDatabase() {
  try {
    try {
      // Clear existing data
      await Leaderboard.destroy({ where: {} });
      await ActivityModel.destroy({ where: {} });
      await User.destroy({ where: {} });

      console.log("Existing data cleared");

      // Create users
      const users = [];
      for (const name of userNames) {
        const user = await User.create({
          full_name: name,
        });
        users.push(user);
      }

      console.log(`Created ${users.length} users`);

      // Create activities for each user
      const activities = [];
      for (const user of users) {
        const activitiesCount = getRandomActivitiesCount();

        for (let i = 0; i < activitiesCount; i++) {
          const activity = await ActivityModel.create({
            user_id: user.user_id,
            points: 20, // Each activity is worth 20 points
          });
          activities.push(activity);
        }
      }

      console.log(`Created ${activities.length} activities`);

      // Calculate leaderboard
      const userPoints = {};
      for (const activity of activities) {
        if (!userPoints[activity.user_id]) {
          userPoints[activity.user_id] = 0;
        }
        userPoints[activity.user_id] += activity.points;
      }

      // Sort users by points
      const sortedUsers = Object.entries(userPoints)
        .map(([user_id, points]) => ({ user_id, points }))
        .sort((a, b) => b.points - a.points);

      // Assign ranks (handling ties)
      let currentRank = 1;
      let previousPoints = null;
      const leaderboardEntries = [];

      for (let i = 0; i < sortedUsers.length; i++) {
        const { user_id, points } = sortedUsers[i];

        // If points are different from previous user, increment rank
        if (previousPoints !== null && previousPoints !== points) {
          currentRank = i + 1;
        }

        const entry = await Leaderboard.create({
          user_id,
          total_points: points,
          rank: currentRank,
        });

        leaderboardEntries.push(entry);
        previousPoints = points;
      }

      console.log(`Created ${leaderboardEntries.length} leaderboard entries`);

      // Commit

      console.log("Database seeded successfully");

      return true;
    } catch (error) {
      // Rollback transaction on error

      console.error("Error seeding database:", error);
      return false;
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
};

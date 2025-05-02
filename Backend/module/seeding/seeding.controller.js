const seedDatabase = require("./seeding.service");
module.exports = async function SeedingController(req, res) {
  try {
    const success = await seedDatabase();

    if (success) {
      return res.json({
        success: true,
        message: "Database seeded successfully",
      });
    } else {
      return res.json(
        {
          error: "Failed to seed database",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    return res.json(
      {
        error: "Failed to seed database",
      },
      { status: 500 }
    );
  }
};

const express = require("express");
const { Space, User } = require("../models");
const router = express.Router();
const authMiddleware = require("../middleware/auth"); // Ensure you have this middleware to verify JWT

// Create Space Route (for Space Owner)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name, location, size, price } = req.body;

    // Check if user is logged in and is a Space Owner
    const userId = req.user.id; // Middleware should attach user info from JWT
    const user = await User.findByPk(userId);

    if (!user || user.role !== "Space Owner") {
      return res.status(403).json({ message: "Only Space Owners can create spaces" });
    }

    // Create new space
    const space = await Space.create({
      name,
      location,
      size,
      price,
      userId,
    });

    res.status(201).json(space); // Return the created space object as response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating space" });
  }
});


// List Spaces Route (public)
router.get("/", async (req, res) => {
  try {
    const spaces = await Space.findAll();
    res.status(200).json(spaces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching spaces" });
  }
});


module.exports = router;

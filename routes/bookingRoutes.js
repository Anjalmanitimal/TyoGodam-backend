const express = require("express");
const { Booking, Space, User } = require("../models");
const router = express.Router();
const authenticate = require("../middleware/auth");

// Create a booking
router.post("/", authenticate, async (req, res) => {
    try {
      console.log("Incoming booking request:", req.body); // ✅ Log request data

      const { spaceId, userId } = req.body;

      if (!spaceId || !userId) {
        return res.status(400).json({ error: "Missing spaceId or userId" }); // ✅ Handle missing data
      }

      // Check if the space exists
      const space = await Space.findByPk(spaceId);
      if (!space) {
        return res.status(404).json({ error: "Space not found" });
      }

      // Create the booking
      const booking = await Booking.create({ spaceId, userId });

      res.status(201).json(booking);
    } catch (error) {
      console.error("Booking error:", error);
      res.status(500).json({ error: "Failed to book space" });
    }
});


// Get all bookings (for space owner)
router.get("/", authenticate, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [{ model: Space }, { model: User }],
    });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

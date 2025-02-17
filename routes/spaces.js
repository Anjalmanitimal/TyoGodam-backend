const express = require("express");
const router = express.Router();
const { Space } = require("../models"); // Import your Space model
const authMiddleware = require("../middleware/auth"); // Import authentication middleware

// Create a new space (POST)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, location, size, price } = req.body;

    if (!name || !location || !size || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newSpace = await Space.create({ name, location, size, price });
    res.status(201).json(newSpace);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating space");
  }
});

// Get all spaces
router.get("/", authMiddleware, async (req, res) => {
  try {
    const spaces = await Space.findAll();
    res.json(spaces);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching spaces");
  }
});

// Update a space (PUT)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, size, price } = req.body;

    const space = await Space.findByPk(id);
    if (!space) {
      return res.status(404).send("Space not found");
    }

    space.name = name;
    space.location = location;
    space.size = size;
    space.price = price;
    await space.save();

    res.json(space);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating space");
  }
});

// Delete a space (DELETE)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const space = await Space.findByPk(id);
    if (!space) {
      return res.status(404).send("Space not found");
    }

    await space.destroy();
    res.json({ message: "Space deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting space");
  }
});

module.exports = router;

// routes/spaces.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { Space } = require("../models");
const authMiddleware = require("../middleware/auth");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp for unique file names
  },
});

const upload = multer({ storage });

// Ensure 'uploads' folder exists
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Serve uploaded images
router.use("/uploads", express.static("uploads"));

// POST route to create a new space (with image upload)
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { name, location, size, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Store image path

    const newSpace = await Space.create({
      name,
      location,
      size,
      price,
      imageUrl,
      ownerId: req.user.id, // The space is owned by the logged-in user
    });

    res.status(201).json(newSpace); // Return newly created space
  } catch (error) {
    console.error("Error creating space:", error);
    res.status(500).send("Error adding space");
  }
});

// GET route to fetch all spaces
router.get("/", authMiddleware, async (req, res) => {
  try {
    const spaces = await Space.findAll();
    res.json(spaces); // Return all spaces
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching spaces");
  }
});

// PUT route to update a space by ID
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

    res.json(space); // Return updated space
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating space");
  }
});

// DELETE route to delete a space by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const space = await Space.findByPk(id);
    if (!space) {
      return res.status(404).send("Space not found");
    }

    await space.destroy(); // Delete space from DB
    res.json({ message: "Space deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting space");
  }
});

module.exports = router;

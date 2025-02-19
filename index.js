// index.js (Main Server File)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { sequelize, User } = require("./models"); // Import sequelize and models

// Initialize Express app
const app = express();

// ✅ Middleware for CORS and JSON parsing
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // Parse JSON bodies

// ✅ Import routes for authentication and spaces
const authRoutes = require("./routes/auth");
const spaceRoutes = require("./routes/spaces"); // Make sure your spaces route is correctly imported

// Use routes in your app
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/spaces", spaceRoutes); // Spaces routes
app.use("/uploads", express.static("uploads"));

// Sample route to check if server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Route for getting users (for debugging/testing)
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Error retrieving users" });
  }
});

// Route for creating a new user (for debugging/testing)
app.post("/users", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Error handling middleware (for catching server errors)
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Set up the server to listen on the port specified in the environment variable or default to 5000
const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
    return sequelize.sync(); // Sync models with the database
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

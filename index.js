require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // Import bcryptjs for password hashing
const { sequelize, User } = require("./models"); // Import sequelize and models

// Initialize Express app
const app = express();

// ✅ Middleware should be applied **before** routes
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend to access backend
app.use(express.json()); // Parse JSON bodies in requests

// ✅ Import & use routes **after** middleware
const authRoutes = require("./routes/auth");
const spaceRoutes = require("./routes/spaces"); // Now correctly handled

app.use("/api/auth", authRoutes);
app.use("/spaces", spaceRoutes); // Space routes properly handled

// Sample route to check if server is working
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Route for getting users
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Error retrieving users", error: error.message });
  }
});

// Route for creating a new user
app.post("/users", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

// Error handling middleware
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
    return sequelize.sync(); // Sync models
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

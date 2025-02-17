const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models"); // Import Sequelize User model

// User Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Registration failed", error });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, "your_secret_key", { expiresIn: "1h" });

    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

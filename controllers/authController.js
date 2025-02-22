const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/userModel");


const saltRounds = 10;
const tokenBlacklist = new Set(); // Store blacklisted tokens (temporary solution)
const resetTokens = new Map(); // Store password reset tokens

// ✅ User Registration
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username is already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ User Login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return res.json({ token, userId: user._id });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Logout (Blacklist Token)
const logout = async (req, res) => {
  // Log that the logout function was called
  console.log("Logout endpoint hit");

  // Retrieve the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Extracted token:", token);

  if (!token) {
    console.error("No token provided");
    return res.status(400).json({ message: "No token provided" });
  }

  // Add the token to the blacklist
  tokenBlacklist.add(token);
  console.log("Token added to blacklist:", token);

  // Return a success response
  console.log("Logout successful");
  return res.json({ message: "Logged out successfully" });
};


// ✅ Verify Token (Check if token is valid)
const verifyToken = async (req, res) => {
  return res.json({ message: "Token is valid", userId: req.user.userId });
};


// ✅ Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const userId = resetTokens.get(token);
    if (!userId) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(userId);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    resetTokens.delete(token);
    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login, logout, resetPassword, verifyToken };

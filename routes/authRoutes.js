const express = require("express");
const { register, login, logout, verifyToken } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ User Registration & Login
router.post("/register", register);
router.post("/login", login);

// ✅ Logout (Token Blacklist)
router.post("/logout", authMiddleware, logout);

// ✅ Verify Token (Check if user is logged in)
router.get("/verify-token", authMiddleware, verifyToken);

module.exports = router;

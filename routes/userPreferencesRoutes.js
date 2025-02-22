const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const UserPreferences = require('../models/userPreferencesModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

const router = express.Router();

// ✅ Create or update user preferences
router.post('/', authMiddleware, async (req, res) => {
  try {
    let userId = req.user.userId;
    console.log("🔍 Received request to update preferences for userId:", userId);

    // ✅ Log incoming request data
    console.log("📥 Incoming request body:", req.body);
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("🚨 Request body is empty. No updates applied.");
      return res.status(400).json({ message: "No data provided for update." });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("🚨 Invalid userId format:", userId);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    userId = new mongoose.Types.ObjectId(userId);

    // ✅ Ensure user exists in database
    const user = await User.findById(userId);
    if (!user) {
      console.log("🚨 User not found in MongoDB for ID:", userId);
      return res.status(404).json({ message: 'User not found in MongoDB' });
    }

    console.log("✅ User found in MongoDB:", user);

    // ✅ Find or create user preferences
    let prefs = await UserPreferences.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId } }, // If document doesn't exist, create it with userId
      { upsert: true, new: true }
    );

    // ✅ Update fields from request
    const updatedFields = {
      weight: req.body.weight ?? prefs.weight,
      height: req.body.height ?? prefs.height,
      age: req.body.age ?? prefs.age,
      gender: req.body.gender ?? prefs.gender,
      favoriteFoods: req.body.favoriteFoods ?? prefs.favoriteFoods,
      dislikedFoods: req.body.dislikedFoods ?? prefs.dislikedFoods,
      typeOfWorkout: req.body.typeOfWorkout ?? prefs.typeOfWorkout,
      days: req.body.days ?? prefs.days,
    };

    // ✅ Apply updates
    prefs = await UserPreferences.findOneAndUpdate(
      { userId },
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    console.log("✅ Preferences updated successfully for userId:", userId);
    console.log("📜 Updated Preferences:", prefs);
    res.json({ message: "User preferences updated successfully", prefs });
  } catch (error) {
    console.error("❌ Error creating/updating preferences:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Get user preferences
router.get('/', authMiddleware, async (req, res) => {
  try {
    let userId = req.user.userId;
    console.log("🔍 Fetching preferences for userId:", userId);

    if (!userId) {
      console.log("🚨 No userId received from token.");
      return res.status(400).json({ message: "Invalid token: Missing user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("🚨 Invalid userId format:", userId);
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    userId = new mongoose.Types.ObjectId(userId);

    const prefs = await UserPreferences.findOne({ userId }).populate("userId");
    if (!prefs) {
      console.log("🚨 No preferences found for userId:", userId);
      return res.status(404).json({ message: "No preferences found" });
    }

    console.log("✅ Preferences retrieved successfully for userId:", userId);
    res.json(prefs);
  } catch (error) {
    console.error("❌ Error fetching preferences:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Log database connection details
mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB Database:", mongoose.connection.name);
});

module.exports = router;

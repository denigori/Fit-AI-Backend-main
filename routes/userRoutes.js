const express = require('express');
const User = require('../models/userModel');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

const router = express.Router();

// ✅ GET: Fetch User Settings
router.get('/settings', authMiddleware, async (req, res) => {
  try {
    console.log("🔍 Received request to /api/users/settings");
    console.log("🔑 Authenticated user:", req.user);
    

    let userId = req.user.userId; // Use `userId` from the auth middleware

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("🚨 Invalid ObjectId format:", userId);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("🚨 User not found in MongoDB for ID:", userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("✅ User found in MongoDB:", user);
    
    // Exclude the password field from the returned user data
    const { password, ...userData } = user._doc;
    console.log("🔑 Authenticated user data:", userData);
    res.json(userData);
    
  } catch (error) {
    console.error("❌ Error in GET /settings:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// ✅ POST: Update User Settings
router.post('/settings', authMiddleware, async (req, res) => {
  try {
    console.log("🔍 Received request to update /api/users/settings");

    let userId = req.user.userId; // Use `userId` from the auth middleware

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("🚨 Invalid ObjectId format:", userId);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("🚨 User not found in MongoDB for ID:", userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Define the fields that are allowed to be updated
    const allowedUpdates = ["name", "lastname", "birthday", "email", "profilePicture"];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Optionally, if you want to allow username or password updates,
    // add separate logic for those fields, such as rehashing the password

    await user.save();

    console.log("✅ User settings updated successfully for userId:", userId);
    res.json({ message: 'User settings updated successfully' });
  } catch (error) {
    console.error("❌ Error in POST /settings:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;

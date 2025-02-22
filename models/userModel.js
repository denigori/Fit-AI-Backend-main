// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:       { type: String, required: true, unique: true },
  password:       { type: String, required: true },
  name:           { type: String },       // First name (optional for now)
  lastname:       { type: String },       // Last name (optional for now)
  birthday:       { type: Date },         // Birthday (optional for now)
  email:          { type: String}, // Email (optional for now)
  profilePicture: { type: String }        // URL or path for profile picture (optional)
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

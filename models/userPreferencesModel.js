// models/userPreferencesModel.js
const mongoose = require('mongoose');

// Each doc references a single User by their _id
const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User', // references the "User" model
    required: true
  },
  weight: String,
  height: String,
  age: String,
  gender: String,
  favoriteFoods: String,
  dislikedFoods: String,
  typeOfWorkout: String,
  days: String
}, { timestamps: true });

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);

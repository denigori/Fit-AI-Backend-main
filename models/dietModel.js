const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dietPlan: { type: String, required: true },
});

const Diet = mongoose.model('Diet', dietSchema);

module.exports = Diet;

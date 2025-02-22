const express = require('express');
const { generateDietPlan, getDietPlan } = require('../controllers/dietController');
const authMiddleware = require('../middleware/authMiddleware');
const dietController = require('../controllers/dietController');

console.log("🛠️ Debugging Imports in dietRoutes.js:");
console.log("🔹 generateDietPlan:", generateDietPlan);
console.log("🔹 getDietPlan:", getDietPlan);

const router = express.Router();

// ✅ Check if generateDietPlan is undefined
if (typeof generateDietPlan !== "function") {
  throw new Error("❌ generateDietPlan is not a function. Check controllers/dietController.js.");
}

// ✅ Check if getDietPlan is undefined
if (typeof getDietPlan !== "function") {
  throw new Error("❌ getDietPlan is not a function. Check controllers/dietController.js.");
}

router.post('/generate', authMiddleware, generateDietPlan);
router.get('/', authMiddleware, getDietPlan);
router.get('/history', authMiddleware, dietController.getDietPlanHistory);

module.exports = router;

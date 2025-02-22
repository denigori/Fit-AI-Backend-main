const express = require('express');
const { generateExercise, getExercisePlan , getExercisePlanHistory } = require('../controllers/exerciseController');
const authMiddleware = require('../middleware/authMiddleware');

console.log("🛠️ Debugging Imports in dietRoutes.js:");
console.log("🔹 generateDietPlan:", generateExercise);
console.log("🔹 getDietPlan:", getExercisePlan);

const router = express.Router();

// ✅ Check if generateExercise is undefined
if (typeof generateExercise !== "function") {
  throw new Error("❌ generateDietPlan is not a function. Check controllers/dietController.js.");
}

// ✅ Check if getExercisePlan is undefined
if (typeof getExercisePlan !== "function") {
  throw new Error("❌ getDietPlan is not a function. Check controllers/dietController.js.");
}

router.post('/generate', authMiddleware, generateExercise);
router.get('/', authMiddleware, getExercisePlan);
router.get('/history', authMiddleware, getExercisePlanHistory);

module.exports = router;

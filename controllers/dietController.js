const Diet = require('../models/dietModel');
const Preferences = require('../models/userPreferencesModel.js');
const { generateDietPlan } = require('../services/chatgpt.js'); // Ensure this import exists

// ✅ Function to generate a diet plan
exports.generateDietPlan = async (req, res) => {
  try {

    const userId = req?.user?.userId;
    //const user = await User.findById(req.user.userId);
    console.log('userId', userId)
    
    const userPreferences = await Preferences.findOne({ userId: userId });
    console.log('generatinggggggggg', userPreferences)
    if (!userPreferences) return res.status(404).json({ message: 'User not found' });


     //console.log({user})
    const dietPlan = await generateDietPlan({
      weight: userPreferences.weight,
      height: userPreferences.height,
      age: userPreferences.age,
      days: userPreferences.days,
      gender: userPreferences.gender,
      favoriteFoods: userPreferences.favoriteFoods,
      dislikedFoods: userPreferences.dislikedFoods,
    });


     const newDiet = new Diet({
      userId: req.user.userId,
      dietPlan: dietPlan,
          });
      const savedDiet = await newDiet.save();

 

    // const newDiet = await Diet.create(
    //   { userId: req.user.userId },
    //   { dietPlan: dietPlan },
    //   //{ new: true, upsert: true }
    // );

    console.log('savedDiet',savedDiet)

    res.json(newDiet);
  } catch (error) {

    console.log('erorrrrr', error)
    res.status(500).json({ message: 'Error generating diet plan', error });
  }
};

// ✅ Function to get paginated diet plan history
exports.getDietPlanHistory = async (req, res) => {
  try {
    console.log('[DEBUG] Entering getDietPlanHistory');

    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    console.log(`[DEBUG] Pagination parameters - page: ${page}, limit: ${limit}`);

    const skip = (page - 1) * limit;
    console.log(`[DEBUG] Calculated skip value: ${skip}`);

    // Log user information
    console.log(`[DEBUG] Fetching diet plans for userId: ${req.user.userId}`);

    // Query the Diet model with pagination
    const dietPlans = await Diet.find({ userId: req.user.userId })
      .sort({ createdAt: -1 }) // If timestamps aren't available, you can sort by _id
      .skip(skip)
      .limit(limit);

    console.log(`[DEBUG] Retrieved ${dietPlans.length} diet plan(s) from database`);

    // Log each fetched diet plan with a truncated version of the dietPlan field
    dietPlans.forEach((plan, index) => {
      const truncatedPlan =
        typeof plan.dietPlan === 'string'
          ? plan.dietPlan.substring(0, 200) + '...'
          : JSON.stringify(plan.dietPlan).substring(0, 200) + '...';
      console.log(`[DEBUG] Record ${index}: _id: ${plan._id}, dietPlan (truncated): ${truncatedPlan}`);
    });

    // Prepare the payload that will be sent to the frontend
    const payload = { dietPlans };
    console.log(`[DEBUG] Payload to be sent to frontend: ${JSON.stringify(payload, null, 2)}`);

    // Return the payload
    res.json(payload);
  } catch (error) {
    console.error('[DEBUG] Error retrieving diet plan history:', error);
    res.status(500).json({ message: 'Error retrieving diet plan history', error });
  }
};



// ✅ Function to get the saved diet plan
exports.getDietPlan = async (req, res) => {
  try {
    const dietPlan = await Diet.findOne({ userId: req.user.userId });
    if (!dietPlan) return res.status(404).json({ message: 'No diet plan found' });

    res.json(dietPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving diet plan', error });
  }
};

const Exercise = require('../models/exerciseModel.js');
const Preferences = require('../models/userPreferencesModel.js');
const { generateExercise } = require('../services/chatgptexercise.js');


exports.generateExercise = async (req, res) => {
    try {
  
      const userId = req?.user?.userId;
      //const user = await User.findById(req.user.userId);
      console.log('userId', userId)
      
      const userPreferences = await Preferences.findOne({ userId: userId });
      console.log('generatinggggggggg', userPreferences)
      if (!userPreferences) return res.status(404).json({ message: 'User not found' });
  
  
       //console.log({user})
      const exercisePlan = await generateExercise({
        weight: userPreferences.weight,
        height: userPreferences.height,
        age: userPreferences.age,
        days: userPreferences.days,
        gender: userPreferences.gender,
      });
  
  
       const newExercise = new Exercise({
        userId: req.user.userId,
        exercisePlan: exercisePlan,
            });
        const savedExercise = await newExercise.save();
  
      // const newExercise = await Exercise.create(
      //   { userId: req.user.userId },
      //   { exercisePlan: exercisePlan },
      //   //{ new: true, upsert: true }
      // );
  
      console.log('savedExercise',savedExercise)
  
      res.json(newExercise);
    } catch (error) {
  
      console.log('erorrrrr', error)
      res.status(500).json({ message: 'Error generating Exercise plan', error });
    }
  };

  // ✅ Function to get the saved diet plan history 
  exports.getExercisePlanHistory = async (req, res) => {
    try {
      console.log('[DEBUG] Entering getExercisePlanHistory');
  
      // Parse pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      console.log(`[DEBUG] Pagination parameters - page: ${page}, limit: ${limit}`);
  
      const skip = (page - 1) * limit;
      console.log(`[DEBUG] Calculated skip value: ${skip}`);
  
      // Log user information
      console.log(`[DEBUG] Fetching exercise plans for userId: ${req.user.userId}`);
  
      // Query the Exercise model with pagination
      const exercisePlans = await Exercise.find({ userId: req.user.userId })
        .sort({ createdAt: -1 }) // Ensure you have timestamps enabled or sort by _id as a fallback
        .skip(skip)
        .limit(limit);
  
      console.log(`[DEBUG] Retrieved ${exercisePlans.length} exercise plan(s) from database`);
  
      // Log each fetched exercise plan with a truncated version of the exercisePlan field
      exercisePlans.forEach((plan, index) => {
        const truncatedPlan =
          typeof plan.exercisePlan === 'string'
            ? plan.exercisePlan.substring(0, 200) + '...'
            : JSON.stringify(plan.exercisePlan).substring(0, 200) + '...';
        console.log(
          `[DEBUG] Record ${index}: _id: ${plan._id}, exercisePlan (truncated): ${truncatedPlan}`
        );
      });
  
      // Prepare payload to be sent to the frontend
      const payload = { exercisePlans };
      console.log(
        `[DEBUG] Payload to be sent to frontend: ${JSON.stringify(payload, null, 2)}`
      );
  
      // Return the payload
      res.json(payload);
    } catch (error) {
      console.error('[DEBUG] Error retrieving exercise plan history:', error);
      res.status(500).json({ message: 'Error retrieving exercise plan history', error });
    }
  };
  

  // ✅ Function to get the saved diet plan
exports.getExercisePlan = async (req, res) => {
    try {
      const exerciseplan = await Exercise.findOne({ userId: req.user.userId });
      if (!exerciseplan) return res.status(404).json({ message: 'No diet plan found' });
  
      res.json(exerciseplan);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving diet plan', error });
    }
  };
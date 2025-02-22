const { OpenAI } = require('openai');
require('dotenv').config();

// Validate that the API key is set
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in the environment variables.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a diet plan based on user data.
 * @param {Object} data - The user data.
 * @param {number} data.weight - The user's weight.
 * @param {number} data.height - The user's height.
 * @param {number} data.age - The user's age.
 * @param {string} data.gender - The user's gender.
 * @param {string} data.favoriteFoods - The user's favorite foods.
 * @param {string} data.dislikedFoods - The user's disliked foods.
 * @returns {Promise<string>} The generated diet plan.
 */
async function generateDietPlan(data) {
  const { weight, height, age, days, gender, favoriteFoods, dislikedFoods } = data;

  // Basic validation
  if (!weight || !height || !age || !gender || !favoriteFoods || !dislikedFoods) {

    console.log("errorrr",error, weight, height,age,gender,favoriteFoods,dislikedFoods);
    throw new Error('All fields are required: weight, height, age, gender, favoriteFoods, and dislikedFoods.');
  }

  const prompt = `
  You are an advanced AI nutritionist creating a customized diet plan for a user based on their profile.

**User Profile:**
- Weight: ${weight} kg
- Height: ${height} cm
- Age: ${age} years
- Gender: ${gender}
- Favorite Foods: ${favoriteFoods}
- Disliked Foods: ${dislikedFoods}
- Total Days: ${days}

   {
     "day": <dayNumber>,
     "meals": [
       { "type": "Breakfast", "meal": "<meal name>", "description": "<brief info>" },
       { "type": "Snack", "meal": "<meal name>", "description": "<brief info>" },
       { "type": "Lunch", "meal": "<meal name>", "description": "<brief info>" },
       { "type": "Snack", "meal": "<meal name>", "description": "<brief info>" },
       { "type": "Dinner", "meal": "<meal name>", "description": "<brief info>" }
     ]
   }
The response should be in json format.

  `;

 console.log("Generated prompt:", prompt);

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-2024-11-20",
      messages: [{ role: "user", content: prompt }],
      response_format: {type: "json_object"},
    });

    if (chatCompletion && chatCompletion.choices && chatCompletion.choices.length > 0) {
      console.log("Diet Plan:", chatCompletion.choices[0].message.content);
      return chatCompletion.choices[0].message.content;
    } else {
      throw new Error('No completion choices returned from OpenAI API.');
    }
  } catch (error) {
    console.error("Error generating diet plan:", error.response ? error.response.data : error.message);
    throw new Error('Failed to generate diet plan. Please try again later.');
  }
}

module.exports = { generateDietPlan };

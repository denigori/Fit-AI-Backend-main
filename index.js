require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');
const dietRoutes = require('./routes/dietRoutes');
const userRoutes = require('./routes/userRoutes'); 
const userPreferencesRoutes = require('./routes/userPreferencesRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const cors = require('cors');


console.log("====== Checking ENV Variables ======");
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("====================================");

const app = express();

app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/preferences', userPreferencesRoutes);
app.use('/api/exercise', exerciseRoutes);
// ✅ Ensure this is here

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

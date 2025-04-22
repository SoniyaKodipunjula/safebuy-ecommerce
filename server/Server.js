// server.js
require("dotenv").config(); // <-- Make sure this is the FIRST line
// Now safely access env variables
const { JWT_SECRET } = process.env;
console.log('JWT_SECRET from .env:', JWT_SECRET);

const mongoose = require('mongoose');

const express = require('express');

const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());
console.log('Connecting to MongoDB URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('SafeBuy API is live');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

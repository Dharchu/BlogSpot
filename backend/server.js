const express = require('express');
const router = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow requests from your Firebase URL
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://bdharchanab_db_user:21uca011@cluster0.dhh0p7o.mongodb.net/?appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));

// Routes
app.use('/api/users', require('./src/routes/users'));
app.use('/api/posts', require('./src/routes/posts')); // This is the correct and only route file we need for posts.

app.get('/', (req, res) => res.send('API running...'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

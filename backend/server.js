const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// This will allow requests from any origin, including your live frontend and admin sites.
app.use(cors());

app.use(express.json({ limit: '10mb' }));

mongoose
  .connect(
    process.env.MONGO_URI ||
      'mongodb+srv://bdharchanab_db_user:21uca011@cluster0.dhh0p7o.mongodb.net/blogspot?retryWrites=true&w=majority'
  )
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api/users', require('./src/routes/users'));
app.use('/api/posts', require('./src/routes/posts'));

app.get('/', (req, res) => res.send('🚀 BlogSpot API is running...'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('⚠️ Global Error:', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

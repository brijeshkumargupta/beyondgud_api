const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({
    status: dbState === 1 ? 'ok' : 'error',
    dbState,
  });
});

// Database Connection
const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/beyondgud';

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    console.error('MongoDB URI:', mongoUri);
    console.error('Please start MongoDB locally or set MONGODB_URI to a reachable MongoDB server.');
    console.error('On macOS with Homebrew: brew services start mongodb-community');
    process.exit(1);
  }
};

startServer();

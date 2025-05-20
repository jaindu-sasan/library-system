require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const config = require('./config');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth/authRoutes'));
app.use('/api/librarian', require('./routes/librarian/librarianRoutes'));
app.use('/api/user', require('./routes/user/userRoutes'));
app.use('/api/shared', require('./routes/shared/sharedRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('Library Management System API');
});

// Start server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

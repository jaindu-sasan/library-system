const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const Librarian = require('../models/Librarian');

module.exports = async (req, res, next) => {
  try {
    // Enhanced logging
    console.log('\nAuth Middleware - Incoming Request:');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('IP:', req.ip);
    console.log('Timestamp:', new Date().toISOString());
    
    // Get token from header
    const token = req.header('x-auth-token') || req.headers.authorization?.split(' ')[1];
    console.log('Extracted Token:', token ? `${token.substring(0, 10)}...` : 'None');

    // Check if no token
    if (!token) {
      console.log('Authentication failed: No token provided');
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        message: 'No authentication token provided' 
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT_SECRET);
      console.log('Token validated for user ID:', decoded.id);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        console.log('Authentication failed: Token expired');
        return res.status(401).json({ 
          success: false,
          error: 'Token expired',
          message: 'Your session has expired. Please log in again.' 
        });
      }
      console.log('Authentication failed: Invalid token');
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token',
        message: 'Invalid authentication token' 
      });
    }

    // Check if user exists
    let user;
    try {
      if (decoded.isLibrarian) {
        user = await Librarian.findById(decoded.id).select('-password');
      } else {
        user = await User.findById(decoded.id).select('-password');
      }

      if (!user) {
        console.log('Authentication failed: User not found');
        return res.status(401).json({ 
          success: false,
          error: 'User not found',
          message: 'The user associated with this token no longer exists' 
        });
      }
    } catch (dbError) {
      console.error('Database error during user lookup:', dbError);
      return res.status(500).json({ 
        success: false,
        error: 'Server error',
        message: 'Error verifying user credentials' 
      });
    }

    // Attach user to request
    req.user = user;
    console.log('Authentication successful for user:', user.email);
    next();
  } catch (err) {
    console.error('Unexpected authentication error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: 'An unexpected error occurred during authentication' 
    });
  }
};

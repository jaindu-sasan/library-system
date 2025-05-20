const express = require('express');
const router = express.Router();
const {
  registerUser,
  registerLibrarian,
  loginUser,
  logoutUser
} = require('../../controllers/auth/authController');

// User registration
router.post('/register', registerUser);

// Librarian registration
router.post('/register/librarian', registerLibrarian);

// Login
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;

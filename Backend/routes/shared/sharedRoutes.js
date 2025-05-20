const express = require('express');
const router = express.Router();
const {
  getBookDetails,
  getUserProfile
} = require('../../controllers/shared/sharedController');
const authMiddleware = require('../../middleware/auth');

router.use(authMiddleware);

// Book details route
router.get('/books/:id', getBookDetails);

// User profile route
router.get('/profile', getUserProfile);

module.exports = router;

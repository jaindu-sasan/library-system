const express = require('express');
const router = express.Router();
const {
  browseBooks,
  getMyBooks,
  getOverdueBooks,
  checkoutBook,
  returnBook,
  getCurrentUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getCheckoutHistory,
  getOverdueHistory
} = require('../../controllers/user/userController');
const authMiddleware = require('../../middleware/auth');

router.use(authMiddleware);

// Book operations
router.get('/books', browseBooks);
router.get('/books/my', getMyBooks);
router.get('/books/overdue', getOverdueBooks);
router.get('/transactions/history', getCheckoutHistory);
router.get('/transactions/overdue', getOverdueHistory);
router.post('/books/checkout', checkoutBook);
router.post('/books/return', returnBook);

// User management
router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

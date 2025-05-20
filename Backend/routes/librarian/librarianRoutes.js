const express = require('express');
const router = express.Router();
const {
  addBook,
  getAllBookDetails,
  manageUsers,
  createUser,
  toggleUserStatus,
  updateUser,
  getUserCount,
  getBookCount,
  getOverdueBooks,
  getRecentCheckouts
} = require('../../controllers/librarian/librarianController');
const authMiddleware = require('../../middleware/auth');

router.use(authMiddleware);

// Book management routes
router.post('/books', addBook);
router.get('/books', getAllBookDetails);

// User management routes
router.get('/users', manageUsers);
router.post('/users', createUser);
router.put('/users/:userId/status', (req, res, next) => {
  console.log('Received toggle status request for user:', req.params.userId);
  toggleUserStatus(req, res, next);
});
router.put('/users/:userId', updateUser);

//dashboard
router.get('/usercount',getUserCount );
router.get('/bookcount',getBookCount);
router.get('/overdue', getOverdueBooks);
router.get('/recent-checkouts', getRecentCheckouts);


module.exports = router;

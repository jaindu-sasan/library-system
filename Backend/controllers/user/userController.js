const Book = require('../../models/Book');
const User = require('../../models/User');
const Transaction = require('../../models/Transaction');

// @desc    Browse all available books
// @route   GET /api/user/books
// @access  Private
const browseBooks = async (req, res) => {
  try {
    const { title, author, category } = req.query;
    const query = { availableCopies: { $gt: 0 } };

    if (title) {
      query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    }
    if (author) {
      query.author = { $regex: author, $options: 'i' }; // Case-insensitive search
    }
    if (category) {
      query.category = category; // Exact match for category
    }

    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's borrowed books
// @route   GET /api/user/books/my
// @access  Private
const { updateOverdueStatus } = require('../../services/transactionService');

const getMyBooks = async (req, res) => {
  try {
    const userId = req.user.id;

    // Update overdue status before fetching
    await updateOverdueStatus(userId);

    const borrowedBooks = await Transaction.find({
      userId,
      returnDate: { $exists: false },
      status: 'checked_out'
    })
      .populate('bookId', 'title author')
      .sort({ dueDate: 1 });
    res.json(borrowedBooks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's overdue books
// @route   GET /api/user/books/overdue
// @access  Private
const getOverdueBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const overdueBooks = await Transaction.find({
      userId,
      dueDate: { $lt: now },
      returnDate: { $exists: false }
    })
      .populate('bookId', 'title author')
      .sort({ dueDate: 1 });
    res.json(overdueBooks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/user/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all users
// @route   GET /api/user
// @access  Private (Admin/Librarian)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user
// @route   PUT /api/user/:id
// @access  Private (Admin/Librarian or same user)
const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/user/:id
// @access  Private (Admin/Librarian)
const { returnBook } = require('../../services/transactionService');

const returnBookHandler = async (req, res) => {
  try {
    const { transactionId } = req.body;

    // Call the existing returnBook service function with transactionId
    await returnBook(transactionId);

    res.json({ 
      success: true, 
      message: 'Book returned successfully',
      transactionId
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

const checkoutBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Book not available' 
      });
    }

    // Update book availability
    book.availableCopies -= 1;
    await book.save();

    // Add book to user's borrowed books - removed as per new transaction model

    // Create a new transaction record
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
    const transaction = new Transaction({
      userId,
      bookId: book._id,
      checkoutDate: new Date(),
      dueDate: dueDate,
      status: 'checked_out',
      isOverdue: false
    });
    await transaction.save();

    res.json({ 
      success: true, 
      message: 'Book checked out successfully',
      bookId: book._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Server Error' 
    });
  }
};


const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getCheckoutHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Update overdue status before fetching
    await updateOverdueStatus(userId);

    const transactions = await Transaction.find({ userId })
      .populate('bookId', 'title author')
      .sort({ checkoutDate: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getOverdueHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Update isOverdue field for overdue transactions
    await Transaction.updateMany(
      {
        userId,
        dueDate: { $lt: now },
        returnDate: { $exists: false },
        isOverdue: false
      },
      { $set: { isOverdue: true, status: 'overdue' } }
    );

    const overdueTransactions = await Transaction.find({
      userId,
      $or: [{ isOverdue: true }, { wasOverdue: true }]
    })
      .populate('bookId', 'title author')
      .select('bookId dueDate returnDate isOverdue wasOverdue')
      .sort({ dueDate: -1 });

    res.json(overdueTransactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  browseBooks,
  getMyBooks,
  getOverdueBooks,
  checkoutBook,
  returnBook: returnBookHandler,
  getCurrentUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getCheckoutHistory,
  getOverdueHistory
};

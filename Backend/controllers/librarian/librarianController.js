const Book = require('../../models/Book');
const User = require('../../models/User');
const Transaction = require('../../models/Transaction')

// @desc    Add a new book
// @route   POST /api/librarian/books
// @access  Private (Librarian)
const addBook = async (req, res) => {
  try {
    const { title, author, isbn, totalCopies, category, publishedDate } = req.body;
    
    // Create new book
    const book = new Book({
      title,
      author,
      isbn,
      totalCopies,
      availableCopies: totalCopies,
      category,
      publishedDate,
      addedBy: req.user.id
    });

    await book.save();
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all books inventory
// @route   GET /api/librarian/books
// @access  Private (Librarian)
// @desc    Get all books inventory
// @route   GET /api/librarian/books
// @access  Private (Librarian)
const getAllBookDetails = async (req, res) => {
  try {
    const books = await Book.find().lean();

    // For each book, get its transactions
    const detailedBooks = await Promise.all(
      books.map(async (book) => {
        const transactions = await Transaction.find({ bookId: book._id })
          .populate('userId', 'name email')
          .sort({ checkoutDate: -1 });

        const currentTx = transactions.find(tx => tx.status === 'checked_out');
        const currentHolder = currentTx ? {
          name: currentTx.userId.name,
          email: currentTx.userId.email,
          checkoutDate: currentTx.checkoutDate,
          dueDate: currentTx.dueDate
        } : null;

        const history = transactions.map(tx => ({
          borrowedBy: tx.userId.name,
          checkoutDate: tx.checkoutDate,
          dueDate: tx.dueDate,
          status: tx.status
        }));

        return {
          _id: book._id,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          availableCopies: book.availableCopies,
          totalCopies: book.totalCopies,
          category: book.category,
          publishedDate: book.publishedDate,
          currentHolder,
          history
        };
      })
    );

    res.status(200).json(detailedBooks);
  } catch (error) {
    console.error('Error in getAllBookDetails:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users
// @route   GET /api/librarian/users
// @access  Private (Librarian)
const manageUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new user
// @route   POST /api/librarian/users
// @access  Private (Librarian)
const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with provided password
    const user = new User({
      name,
      email,
      password: req.body.password,
      role: role || 'user',
      isActive: true
    });

    await user.save();
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/librarian/users/:userId/status
// @access  Private (Librarian)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: user.toObject()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user details
// @route   PUT /api/librarian/users/:userId
// @access  Private (Librarian)
const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, email, role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getBookCount = async (req, res) => {
  try {
    const count = await Book.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to count books' });
  }
};


const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to count users' });
  }
};

const getOverdueBooks = async (req, res) => {
  try {
    const now = new Date();
    const overdue = await Transaction.find({
      status: 'overdue',
      dueDate: { $lt: now },
    })
      .populate('userId', 'name')
      .populate('bookId', 'title');

    const formatted = overdue.map(tx => {
      const daysLate = Math.ceil((now - tx.dueDate) / (1000 * 60 * 60 * 24));
      const feePerDay = 1; // Customize this as needed
      const fee = daysLate * feePerDay;

      return {
        _id: tx._id,
        title: tx.bookId.title,
        userId: { name: tx.userId.name },
        daysLate,
        fee,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch overdue books' });
  }
};

const getRecentCheckouts = async (req, res) => {
  try {
    const recent = await Transaction.find()
      .sort({ checkoutDate: -1 })
      .limit(5)
      .populate('userId', 'name')
      .populate('bookId', 'title');

    const formatted = recent.map(tx => ({
      _id: tx._id,
      bookTitle: tx.bookId.title,
      userName: tx.userId.name,
      checkoutDate: tx.checkoutDate,
      dueDate: tx.dueDate,
      status: tx.status,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
};

module.exports = {
  addBook,
  getAllBookDetails,
  manageUsers,
  createUser,
  toggleUserStatus,
  updateUser,
  getBookCount,
  getUserCount,
  getOverdueBooks,
  getRecentCheckouts
};

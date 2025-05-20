const Book = require('../../models/Book');
const User = require('../../models/User');
const Librarian = require('../../models/Librarian');

// @desc    Get book details
// @route   GET /api/shared/books/:id
// @access  Private
const getBookDetails = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'name email');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user profile
// @route   GET /api/shared/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    let profile;
    if (req.user.isAdmin) {
      profile = await Librarian.findById(req.user.id).select('-password');
    } else {
      profile = await User.findById(req.user.id).select('-password');
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getBookDetails,
  getUserProfile
};

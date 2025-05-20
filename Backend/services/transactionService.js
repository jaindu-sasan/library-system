const mongoose = require('mongoose');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

// Calculate due date (14 days from now)
const calculateDueDate = () => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  return dueDate;
};

// @desc    Checkout a book
// @return  {Promise}
const checkoutBook = async (userId, bookId) => {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new Error('Book not found');
  }

  if (book.availableCopies <= 0) {
    throw new Error('No available copies');
  }

  // Check if user already has this book checked out and not returned
  const existingTransaction = await Transaction.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    bookId: new mongoose.Types.ObjectId(bookId),
    returnDate: { $exists: false }
  });
  if (existingTransaction) {
    throw new Error('User already has this book checked out');
  }

  // Update book available copies
  book.availableCopies -= 1;
  await book.save();

  // Create a new transaction record
  const transaction = new Transaction({
    userId: new mongoose.Types.ObjectId(userId),
    bookId: new mongoose.Types.ObjectId(bookId),
    checkoutDate: new Date(),
    dueDate: calculateDueDate(),
    status: 'checked_out',
    isOverdue: false
  });
  await transaction.save();

  return { book, transaction };
};

// @desc    Return a book
// @return  {Promise}
const returnBook = async (transactionId) => {
  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const book = await Book.findById(transaction.bookId);

  if (!book) {
    throw new Error('Book not found');
  }

  if (transaction.returnDate) {
    throw new Error('Book already returned');
  }

  // Update book available copies
  book.availableCopies += 1;
  await book.save();

  // Update the transaction record with returnDate and status
  transaction.returnDate = new Date();
  transaction.status = 'returned';

  // Preserve overdue history
  if (transaction.isOverdue) {
    transaction.wasOverdue = true;
  }
  transaction.isOverdue = false;

  await transaction.save();

  return { book, transaction };
};

// @desc    Update overdue status for a user's transactions
// @return  {Promise}
const updateOverdueStatus = async (userId) => {
  const now = new Date();
  await Transaction.updateMany(
    {
      userId: new mongoose.Types.ObjectId(userId),
      dueDate: { $lt: now },
      returnDate: { $exists: false },
      isOverdue: false
    },
    { $set: { isOverdue: true, status: 'overdue' } }
  );
};

module.exports = {
  checkoutBook,
  returnBook,
  updateOverdueStatus
};

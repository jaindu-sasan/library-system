const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  checkoutDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  fees: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['checked_out', 'returned', 'overdue'],
    default: 'checked_out'
  },
  isOverdue: {
    type: Boolean,
    default: false
  },
  wasOverdue: {
    type: Boolean,
    default: false
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

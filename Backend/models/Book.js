const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0
  },
  totalCopies: {
    type: Number,
    required: true,
    min: 1
  },
  category: {
    type: String,
    required: true
  },
  publishedDate: Date,
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Librarian',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', BookSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const LibrarianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
LibrarianSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    console.log('Original password before hashing:', this.password);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Hashed password:', this.password);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
LibrarianSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('Comparing passwords for:', this.email);
    console.log('Provided password:', candidatePassword);
    console.log('Stored hash:', this.password);
    
    // Ensure both values are strings
    const passwordStr = String(candidatePassword);
    const hashStr = String(this.password);
    
    const result = await bcrypt.compare(passwordStr, hashStr);
    if (result) return true;
    
    // Fallback to plaintext comparison for legacy passwords
    if (this.password === candidatePassword) {
      // If plaintext matches, hash it properly
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(candidatePassword, salt);
      await this.save();
      return true;
    }
    
    console.log('Comparison result:', result);
    return false;
  } catch (err) {
    console.error('Password comparison error:', err);
    return false;
  }
};

module.exports = mongoose.model('Librarian', LibrarianSchema);

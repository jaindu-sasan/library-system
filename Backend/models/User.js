const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
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
  role: {
    type: String,
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // First try bcrypt comparison
    const isMatch = await bcrypt.compare(String(candidatePassword), String(this.password));
    if (isMatch) return true;
    
    // Fallback to plaintext comparison for legacy passwords
    if (this.password === candidatePassword) {
      // If plaintext matches, hash it properly
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(candidatePassword, salt);
      await this.save();
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('Password comparison error:', err);
    return false;
  }
};

module.exports = mongoose.model('User', UserSchema);

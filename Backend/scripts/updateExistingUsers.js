const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('../config');

async function updateUsers() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all users to have isActive: true if not set
    const result = await User.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true, role: 'user' } }
    );

    console.log(`Updated ${result.nModified} users`);
    process.exit(0);
  } catch (err) {
    console.error('Error updating users:', err);
    process.exit(1);
  }
}

updateUsers();

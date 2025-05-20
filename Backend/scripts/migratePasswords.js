const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config');
const User = require('../models/User');

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function migratePasswords() {
  try {
    const users = await User.find();
    let updatedCount = 0;

    for (const user of users) {
      // Skip if password is already hashed
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        continue;
      }

      // Hash plaintext password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      updatedCount++;
    }

    console.log(`Successfully migrated ${updatedCount} user passwords`);
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migratePasswords();

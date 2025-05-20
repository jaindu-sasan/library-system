const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config');
const Librarian = require('../models/Librarian');

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function migrateLibrarianPasswords() {
  try {
    const librarians = await Librarian.find();
    let updatedCount = 0;

    for (const librarian of librarians) {
      // Skip if password is already hashed
      if (librarian.password.startsWith('$2a$') || librarian.password.startsWith('$2b$')) {
        continue;
      }

      // Hash plaintext password
      const salt = await bcrypt.genSalt(10);
      librarian.password = await bcrypt.hash(librarian.password, salt);
      await librarian.save();
      updatedCount++;
    }

    console.log(`Successfully migrated ${updatedCount} librarian passwords`);
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migrateLibrarianPasswords()
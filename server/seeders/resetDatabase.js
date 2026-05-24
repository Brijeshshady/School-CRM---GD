require('dotenv').config();
const mongoose = require('mongoose');

const resetDatabase = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('\x1b[31m%s\x1b[0m', 'CRITICAL: Database reset is blocked in production!');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for reset...');

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
      console.log(`Cleared collection: ${collection.collectionName}`);
    }

    console.log('\x1b[32m%s\x1b[0m', 'Database reset successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
};

resetDatabase();

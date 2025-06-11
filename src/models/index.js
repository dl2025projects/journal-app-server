const sequelize = require('../config/database');
const User = require('./User');
const JournalEntry = require('./JournalEntry');

// Sync all models with the database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  JournalEntry,
  syncDatabase
}; 
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const JournalEntry = sequelize.define('JournalEntry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      name: 'journal_entry_date_idx',
      fields: ['date']
    },
    {
      name: 'journal_entry_user_id_idx',
      fields: ['userId']
    }
  ]
});

// Define the relationship between User and JournalEntry
User.hasMany(JournalEntry, { 
  foreignKey: 'userId',
  as: 'entries',
  onDelete: 'CASCADE'
});

JournalEntry.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user'
});

module.exports = JournalEntry; 
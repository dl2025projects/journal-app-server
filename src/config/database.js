const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determine the database dialect from environment or default to mysql
const DIALECT = process.env.DB_DIALECT || 'mysql';

// Database connection options
let config = {
  dialect: DIALECT,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Add dialect-specific options
if (DIALECT === 'mysql') {
  config.dialectOptions = {
    charset: 'utf8mb4'
  };
} else if (DIALECT === 'postgres' && process.env.NODE_ENV === 'production') {
  // Specific configuration for PostgreSQL in production (Render)
  config.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
}

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  config
);

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log(`Database connection established successfully using ${DIALECT}.`);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize; 
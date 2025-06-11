const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Hard-coded fallback secret for development
    const jwtSecret = process.env.JWT_SECRET || 'mysecretkey123456789';
    
    // Verify token
    try {
      const decoded = jwt.verify(token, jwtSecret);
      
      // Find the user
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'Session expired. Please log in again.' });
      }
      
      // Attach user to request object
      req.user = user;
      req.token = token;
      
      next();
    } catch (jwtError) {
      if (jwtError.name === 'JsonWebTokenError' || jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Session expired. Please log in again.' });
      }
      throw jwtError; // Re-throw if it's not a token error
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = auth; 
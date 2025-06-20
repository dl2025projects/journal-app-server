const jwt = require('jsonwebtoken');
const { User, sequelize } = require('../models');
const { Op } = require('sequelize');
require('dotenv').config();

// Generate JWT token
const generateToken = (id) => {
  // Hard-coded fallback secret for development
  const jwtSecret = process.env.JWT_SECRET || 'mysecretkey123456789';
  console.log('Using JWT Secret:', jwtSecret ? 'Secret exists' : 'No secret found');
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d'
  });
}

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    // Add CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { username }] 
      } 
    });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    try {
      const user = await User.create({
        username,
        email,
        password
      });

      if (user) {
        res.status(201).json({
          id: user.id,
          username: user.username,
          email: user.email,
          token: generateToken(user.id)
        });
      } else {
        res.status(400).json({ message: 'Invalid user data' });
      }
    } catch (validationError) {
      // Handle validation errors
      if (validationError.name === 'SequelizeValidationError') {
        const errors = validationError.errors.map(err => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({ message: 'Validation failed', errors });
      }
      throw validationError; // re-throw if it's not a validation error
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Authenticate user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    // Add CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists and password matches
    if (user && (await user.isValidPassword(password))) {
      // Update last login date
      user.lastLoginDate = new Date();
      await user.save();

      // Create a token with long expiration
      const token = generateToken(user.id);
      console.log(`Generated token for user ${user.id}`);

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        token: token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // Add CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // req.user is set by the auth middleware
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'createdAt', 'lastLoginDate']
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
}; 
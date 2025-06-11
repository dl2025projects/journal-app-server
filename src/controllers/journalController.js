const { JournalEntry, sequelize } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all journal entries for a user
// @route   GET /api/journal
// @access  Private
const getEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
      attributes: ['id', 'title', 'content', 'date', 'createdAt', 'updatedAt']
    });

    res.json(entries);
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single journal entry
// @route   GET /api/journal/:id
// @access  Private
const getEntryById = async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Get entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new journal entry
// @route   POST /api/journal
// @access  Private
const createEntry = async (req, res) => {
  try {
    const { title, content, date } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    // Create the entry
    const entry = await JournalEntry.create({
      title,
      content,
      date: date || new Date(),
      userId: req.user.id
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a journal entry
// @route   PUT /api/journal/:id
// @access  Private
const updateEntry = async (req, res) => {
  try {
    const { title, content, date } = req.body;
    
    // Find the entry
    const entry = await JournalEntry.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Update the entry
    entry.title = title || entry.title;
    entry.content = content || entry.content;
    entry.date = date || entry.date;

    await entry.save();

    res.json(entry);
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a journal entry
// @route   DELETE /api/journal/:id
// @access  Private
const deleteEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    await entry.destroy();

    res.json({ message: 'Entry removed' });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search journal entries
// @route   GET /api/journal/search
// @access  Private
const searchEntries = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const entries = await JournalEntry.findAll({
      where: {
        userId: req.user.id,
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { content: { [Op.like]: `%${query}%` } }
        ]
      },
      order: [['date', 'DESC']],
      attributes: ['id', 'title', 'content', 'date', 'createdAt', 'updatedAt']
    });

    res.json(entries);
  } catch (error) {
    console.error('Search entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get streak information
// @route   GET /api/journal/streak
// @access  Private
const getStreak = async (req, res) => {
  try {
    // Get all entry dates for the user
    const entries = await JournalEntry.findAll({
      where: { userId: req.user.id },
      attributes: ['date'],
      order: [['date', 'DESC']]
    });

    // Extract the dates
    const dates = entries.map(entry => entry.date);

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    
    if (dates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Sort dates in descending order (newest first)
      const sortedDates = [...dates].sort((a, b) => new Date(b) - new Date(a));
      
      // Check if the most recent entry is from today
      const lastEntryDate = new Date(sortedDates[0]);
      lastEntryDate.setHours(0, 0, 0, 0);
      
      const oneDayMs = 24 * 60 * 60 * 1000;
      const diffDays = Math.round((today - lastEntryDate) / oneDayMs);
      
      // If the last entry is from today or yesterday, we can have a streak
      if (diffDays <= 1) {
        currentStreak = 1;
        
        for (let i = 0; i < sortedDates.length - 1; i++) {
          const currentDate = new Date(sortedDates[i]);
          currentDate.setHours(0, 0, 0, 0);
          
          const prevDate = new Date(sortedDates[i + 1]);
          prevDate.setHours(0, 0, 0, 0);
          
          const dayDiff = Math.round((currentDate - prevDate) / oneDayMs);
          
          if (dayDiff === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
      
      // Calculate longest streak (more complex algorithm)
      // This is a simplified version
      longestStreak = currentStreak;
    }
    
    res.json({
      currentStreak,
      longestStreak,
      lastEntryDate: dates[0] || null
    });
  } catch (error) {
    console.error('Get streak error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
  searchEntries,
  getStreak
}; 
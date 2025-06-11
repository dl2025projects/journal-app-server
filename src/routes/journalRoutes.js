const express = require('express');
const router = express.Router();
const { 
  getEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
  searchEntries,
  getStreak
} = require('../controllers/journalController');
const auth = require('../middleware/auth');

// Protect all routes
router.use(auth);

/**
 * @swagger
 * /api/journal:
 *   get:
 *     summary: Get all journal entries for the logged in user
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of journal entries
 *       401:
 *         description: Not authorized
 */
router.get('/', getEntries);

/**
 * @swagger
 * /api/journal/search:
 *   get:
 *     summary: Search journal entries
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of matching journal entries
 *       401:
 *         description: Not authorized
 */
router.get('/search', searchEntries);

/**
 * @swagger
 * /api/journal/streak:
 *   get:
 *     summary: Get streak information
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Streak information
 *       401:
 *         description: Not authorized
 */
router.get('/streak', getStreak);

/**
 * @swagger
 * /api/journal/{id}:
 *   get:
 *     summary: Get a journal entry by ID
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Journal entry ID
 *     responses:
 *       200:
 *         description: Journal entry details
 *       404:
 *         description: Journal entry not found
 *       401:
 *         description: Not authorized
 */
router.get('/:id', getEntryById);

/**
 * @swagger
 * /api/journal:
 *   post:
 *     summary: Create a new journal entry
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Journal entry created
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Not authorized
 */
router.post('/', createEntry);

/**
 * @swagger
 * /api/journal/{id}:
 *   put:
 *     summary: Update a journal entry
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Journal entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Journal entry updated
 *       404:
 *         description: Journal entry not found
 *       401:
 *         description: Not authorized
 */
router.put('/:id', updateEntry);

/**
 * @swagger
 * /api/journal/{id}:
 *   delete:
 *     summary: Delete a journal entry
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Journal entry ID
 *     responses:
 *       200:
 *         description: Journal entry deleted
 *       404:
 *         description: Journal entry not found
 *       401:
 *         description: Not authorized
 */
router.delete('/:id', deleteEntry);

module.exports = router; 
const express = require('express');
const router = express.Router();
const { seedDatabase } = require('../utils/seed');

/**
 * @swagger
 * /api/seed:
 *   post:
 *     summary: Seed database with sample data
 *     description: Populates the database with sample service categories, providers, customers, and matches
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: Database seeded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: integer
 *                     providers:
 *                       type: integer
 *                     customers:
 *                       type: integer
 *                     matches:
 *                       type: integer
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const result = await seedDatabase();
    res.json(result);
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

// Also support GET for easy browser testing
router.get('/', async (req, res) => {
  try {
    const result = await seedDatabase();
    res.json(result);
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

module.exports = router;
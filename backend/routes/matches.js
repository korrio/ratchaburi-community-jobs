const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

/**
 * @swagger
 * components:
 *   schemas:
 *     JobMatch:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Match ID
 *         provider_id:
 *           type: integer
 *           description: Provider ID
 *         customer_id:
 *           type: integer
 *           description: Customer ID
 *         match_score:
 *           type: number
 *           description: Match score (0-1)
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected, completed, cancelled]
 *           description: Match status
 *         provider_response:
 *           type: string
 *           description: Provider response
 *         customer_response:
 *           type: string
 *           description: Customer response
 *         rating:
 *           type: integer
 *           description: Job rating (1-5)
 *         feedback:
 *           type: string
 *           description: Job feedback
 *         match_date:
 *           type: string
 *           format: date-time
 *         response_date:
 *           type: string
 *           format: date-time
 *         completion_date:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/matches:
 *   get:
 *     summary: Get all job matches
 *     tags: [Matches]
 *     parameters:
 *       - in: query
 *         name: provider_id
 *         schema:
 *           type: integer
 *         description: Filter by provider ID
 *       - in: query
 *         name: customer_id
 *         schema:
 *           type: integer
 *         description: Filter by customer ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected, completed, cancelled]
 *         description: Filter by match status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [match_date, match_score, response_date]
 *           default: match_date
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of job matches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobMatch'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
router.get('/', matchController.getMatches);

/**
 * @swagger
 * /api/matches/{id}:
 *   get:
 *     summary: Get match by ID
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Match ID
 *     responses:
 *       200:
 *         description: Match details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/JobMatch'
 *       404:
 *         description: Match not found
 */
router.get('/:id', matchController.getMatch);

/**
 * @swagger
 * /api/matches:
 *   post:
 *     summary: Create manual job match
 *     tags: [Matches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider_id
 *               - customer_id
 *             properties:
 *               provider_id:
 *                 type: integer
 *               customer_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Match created successfully
 *       400:
 *         description: Validation error or match already exists
 *       404:
 *         description: Provider or customer not found
 */
router.post('/', matchController.createMatch);

/**
 * @swagger
 * /api/matches/{id}/status:
 *   put:
 *     summary: Update match status
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Match ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected, completed, cancelled]
 *               provider_response:
 *                 type: string
 *               customer_response:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: Match status updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Match not found
 */
router.put('/:id/status', matchController.updateMatchStatus);

/**
 * @swagger
 * /api/matches/stats:
 *   get:
 *     summary: Get match statistics
 *     tags: [Matches]
 *     responses:
 *       200:
 *         description: Match statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_matches:
 *                       type: integer
 *                     pending_matches:
 *                       type: integer
 *                     accepted_matches:
 *                       type: integer
 *                     completed_matches:
 *                       type: integer
 *                     rejected_matches:
 *                       type: integer
 *                     avg_match_score:
 *                       type: number
 *                     avg_rating:
 *                       type: number
 *                     top_categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           icon:
 *                             type: string
 *                           match_count:
 *                             type: integer
 */
router.get('/stats', matchController.getMatchStats);

module.exports = router;
const express = require('express');
const router = express.Router();
const jobProgressController = require('../controllers/jobProgressController');

/**
 * @swagger
 * components:
 *   schemas:
 *     JobProgress:
 *       type: object
 *       properties:
 *         match_id:
 *           type: integer
 *           description: Job match ID
 *         stage:
 *           type: string
 *           enum: [accepted, arrived, started, completed, closed]
 *           description: Current job stage
 *         timestamp:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *           description: Additional notes for this stage
 *         location_info:
 *           type: string
 *           description: Location information
 *     CustomerFeedback:
 *       type: object
 *       properties:
 *         service_rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         quality_rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         timeliness_rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         overall_rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         feedback_text:
 *           type: string
 *         would_recommend:
 *           type: boolean
 *         would_hire_again:
 *           type: boolean
 */

/**
 * @swagger
 * /api/job-progress:
 *   get:
 *     summary: Get all jobs with progress (Admin)
 *     tags: [Job Progress]
 *     parameters:
 *       - in: query
 *         name: stage
 *         schema:
 *           type: string
 *           enum: [accepted, arrived, started, completed, closed]
 *         description: Filter by job stage
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
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of jobs with progress information
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
 *                     $ref: '#/components/schemas/JobProgress'
 *                 pagination:
 *                   type: object
 *                 stage_stats:
 *                   type: object
 */
router.get('/', jobProgressController.getAllJobsWithProgress);

/**
 * @swagger
 * /api/job-progress/{matchId}:
 *   get:
 *     summary: Get progress for specific job
 *     tags: [Job Progress]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job match ID
 *     responses:
 *       200:
 *         description: Job progress details
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
 *                     match:
 *                       type: object
 *                     current_stage:
 *                       type: string
 *                     progress_history:
 *                       type: array
 *                     customer_feedback:
 *                       type: object
 *                     stage_definitions:
 *                       type: object
 *       404:
 *         description: Job match not found
 */
router.get('/:matchId', jobProgressController.getJobProgress);

/**
 * @swagger
 * /api/job-progress/{matchId}/update:
 *   post:
 *     summary: Update job progress to next stage
 *     tags: [Job Progress]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job match ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stage
 *             properties:
 *               stage:
 *                 type: string
 *                 enum: [accepted, arrived, started, completed, closed]
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *               location_info:
 *                 type: string
 *                 description: Location information
 *               estimated_duration:
 *                 type: string
 *                 description: Estimated duration (for started stage)
 *               actual_duration:
 *                 type: string
 *                 description: Actual duration (for completed stage)
 *               final_cost:
 *                 type: number
 *                 description: Final job cost (for completed stage)
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Job match not found
 */
router.post('/:matchId/update', jobProgressController.updateJobProgress);

/**
 * @swagger
 * /api/job-progress/{matchId}/customer-feedback:
 *   post:
 *     summary: Submit customer feedback and rating
 *     tags: [Job Progress]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job match ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerFeedback'
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Job match not found or not in completed stage
 */
router.post('/:matchId/customer-feedback', jobProgressController.submitCustomerFeedback);

module.exports = router;
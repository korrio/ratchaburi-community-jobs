const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Provider:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Provider ID
 *         name:
 *           type: string
 *           description: Provider name
 *         phone:
 *           type: string
 *           description: Phone number
 *         line_id:
 *           type: string
 *           description: LINE ID
 *         service_category_id:
 *           type: integer
 *           description: Service category ID
 *         location:
 *           type: string
 *           description: Address
 *         district:
 *           type: string
 *           description: District
 *         subdistrict:
 *           type: string
 *           description: Subdistrict
 *         province:
 *           type: string
 *           description: Province
 *         description:
 *           type: string
 *           description: Service description
 *         price_range:
 *           type: string
 *           description: Price range
 *         available_days:
 *           type: string
 *           description: Available days
 *         available_hours:
 *           type: string
 *           description: Available hours
 *         rating:
 *           type: number
 *           description: Rating (0-5)
 *         total_jobs:
 *           type: integer
 *           description: Total completed jobs
 *         is_active:
 *           type: boolean
 *           description: Active status
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/providers:
 *   get:
 *     summary: Get all service providers
 *     tags: [Providers]
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by service category
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: Filter by district
 *       - in: query
 *         name: subdistrict
 *         schema:
 *           type: string
 *         description: Filter by subdistrict
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or description
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
 *           enum: [name, rating, total_jobs, created_at]
 *           default: rating
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
 *         description: List of providers
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
 *                     $ref: '#/components/schemas/Provider'
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
router.get('/', providerController.getProviders);

/**
 * @swagger
 * /api/providers/categories:
 *   get:
 *     summary: Get all service categories
 *     tags: [Providers]
 *     responses:
 *       200:
 *         description: List of service categories
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       icon:
 *                         type: string
 */
router.get('/categories', providerController.getCategories);

/**
 * @swagger
 * /api/providers/{id}:
 *   get:
 *     summary: Get provider by ID
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Provider ID
 *     responses:
 *       200:
 *         description: Provider details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Provider'
 *       404:
 *         description: Provider not found
 */
router.get('/:id', providerController.getProvider);

/**
 * @swagger
 * /api/providers:
 *   post:
 *     summary: Create new provider
 *     tags: [Providers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Provider'
 *     responses:
 *       201:
 *         description: Provider created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', providerController.createProvider);

/**
 * @swagger
 * /api/providers/{id}:
 *   put:
 *     summary: Update provider
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Provider ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Provider'
 *     responses:
 *       200:
 *         description: Provider updated successfully
 *       404:
 *         description: Provider not found
 *       400:
 *         description: Validation error
 */
router.put('/:id', providerController.updateProvider);

/**
 * @swagger
 * /api/providers/{id}:
 *   delete:
 *     summary: Delete provider
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Provider ID
 *     responses:
 *       200:
 *         description: Provider deleted successfully
 *       404:
 *         description: Provider not found
 */
router.delete('/:id', providerController.deleteProvider);

module.exports = router;
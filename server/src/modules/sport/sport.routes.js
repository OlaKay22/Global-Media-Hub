// src/modules/sport/sport.routes.js
const express = require('express');
const router = express.Router();
const controller = require('./sport.controller');
const { authenticate, authorize } = require('../../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Sport
 *   description: Sports articles, leagues, team filtering, and live data
 */

/**
 * @swagger
 * /api/v1/sport/articles:
 *   get:
 *     summary: Get all published sport articles
 *     tags: [Sport]
 *     parameters:
 *       - in: query
 *         name: league
 *         schema:
 *           type: string
 *           enum: [premier-league, la-liga, serie-a, bundesliga, ligue-1]
 *         description: Filter by league
 *       - in: query
 *         name: team
 *         schema: { type: string }
 *         description: Filter by team slug (e.g. "arsenal")
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *     responses:
 *       200:
 *         description: A paginated list of sport articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Article' }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 */
router.get('/articles', controller.getArticles);

/**
 * @swagger
 * /api/v1/sport/articles/{slug}:
 *   get:
 *     summary: Get a single sport article by slug
 *     tags: [Sport]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: A single sport article
 *       404:
 *         description: Article not found
 */
router.get('/articles/:slug', controller.getArticleBySlug);

/**
 * @swagger
 * /api/v1/sport/leagues:
 *   get:
 *     summary: Get list of all supported leagues and their teams
 *     tags: [Sport]
 *     responses:
 *       200:
 *         description: League and team data
 */
router.get('/leagues', controller.getLeagues);

/**
 * @swagger
 * /api/v1/sport/live:
 *   get:
 *     summary: Get live match scores (cached via Redis)
 *     tags: [Sport]
 *     responses:
 *       200:
 *         description: Live match data from API-Sports
 */
router.get('/live', controller.getLiveScores);

// --- Admin-protected write routes ---
/**
 * @swagger
 * /api/v1/sport/articles:
 *   post:
 *     summary: Create a new sport article (Admin only)
 *     tags: [Sport]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, category, author]
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               category: { type: string }
 *               author: { type: string }
 *               league: { type: string }
 *               teamSlug: { type: string }
 *               imageUrl: { type: string }
 *               published: { type: boolean }
 *     responses:
 *       201:
 *         description: Article created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/articles', authenticate, authorize('ADMIN', 'EDITOR'), controller.createArticle);

/**
 * @swagger
 * /api/v1/sport/articles/{id}:
 *   put:
 *     summary: Update a sport article (Admin only)
 *     tags: [Sport]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Article updated
 *   delete:
 *     summary: Delete a sport article (Admin only)
 *     tags: [Sport]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Article deleted
 */
router.put('/articles/:id', authenticate, authorize('ADMIN', 'EDITOR'), controller.updateArticle);
router.delete('/articles/:id', authenticate, authorize('ADMIN'), controller.deleteArticle);

module.exports = router;

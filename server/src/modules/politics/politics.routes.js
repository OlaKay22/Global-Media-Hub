// src/modules/politics/politics.routes.js
const express = require('express');
const router = express.Router();
const controller = require('./politics.controller');
const { authenticate, authorize } = require('../../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Politics
 *   description: Local, international, and policy update articles
 */

/**
 * @swagger
 * /api/v1/politics/articles:
 *   get:
 *     summary: Get published politics articles
 *     tags: [Politics]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [local, international, policy-update]
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *           enum: [north-america, europe, asia, africa]
 *         description: Filter local news by geographic region
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *     responses:
 *       200:
 *         description: Paginated politics articles
 */
router.get('/articles', controller.getArticles);
router.get('/articles/:slug', controller.getArticleBySlug);

/**
 * @swagger
 * /api/v1/politics/policy-updates:
 *   get:
 *     summary: Get latest TL;DR policy update cards
 *     tags: [Politics]
 *     responses:
 *       200:
 *         description: List of policy update articles with structured TL;DR fields
 */
router.get('/policy-updates', controller.getPolicyUpdates);

// Admin routes
router.post('/articles', authenticate, authorize('ADMIN', 'EDITOR'), controller.createArticle);
router.put('/articles/:id', authenticate, authorize('ADMIN', 'EDITOR'), controller.updateArticle);
router.delete('/articles/:id', authenticate, authorize('ADMIN'), controller.deleteArticle);

module.exports = router;

// src/modules/finance/finance.routes.js
const express = require('express');
const router = express.Router();
const controller = require('./finance.controller');
const { authenticate, authorize } = require('../../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Finance
 *   description: Market data, personal finance articles, and global trends
 */

/**
 * @swagger
 * /api/v1/finance/articles:
 *   get:
 *     summary: Get published finance articles
 *     tags: [Finance]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [market, personal-finance, global-trends, business]
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *     responses:
 *       200:
 *         description: Paginated finance articles
 */
router.get('/articles', controller.getArticles);
router.get('/articles/:slug', controller.getArticleBySlug);

/**
 * @swagger
 * /api/v1/finance/ticker:
 *   get:
 *     summary: Get live market ticker data (indices + crypto, cached 60s)
 *     tags: [Finance]
 *     responses:
 *       200:
 *         description: Live market ticker data
 */
router.get('/ticker', controller.getTicker);

// Admin routes
router.post('/articles', authenticate, authorize('ADMIN', 'EDITOR'), controller.createArticle);
router.put('/articles/:id', authenticate, authorize('ADMIN', 'EDITOR'), controller.updateArticle);
router.delete('/articles/:id', authenticate, authorize('ADMIN'), controller.deleteArticle);

module.exports = router;

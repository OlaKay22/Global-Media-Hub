// src/modules/relationship/relationship.routes.js
const express = require('express');
const router = express.Router();
const controller = require('./relationship.controller');
const { authenticate, authorize } = require('../../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Relationship
 *   description: Lifestyle, advice, community submissions, and celebrity news
 */

/**
 * @swagger
 * /api/v1/relationship/articles:
 *   get:
 *     summary: Get published relationship/lifestyle articles
 *     tags: [Relationship]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [lifestyle, advice, celebrity-news]
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *     responses:
 *       200:
 *         description: Paginated relationship articles
 */
router.get('/articles', controller.getArticles);
router.get('/articles/:slug', controller.getArticleBySlug);

/**
 * @swagger
 * /api/v1/relationship/community:
 *   get:
 *     summary: Get approved community spotlight stories
 *     tags: [Relationship]
 *     responses:
 *       200:
 *         description: List of approved community stories
 *   post:
 *     summary: Submit a community story for review
 *     tags: [Relationship]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, title, story]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               title: { type: string }
 *               story: { type: string }
 *     responses:
 *       201:
 *         description: Story submitted for review
 */
router.get('/community', controller.getCommunityStories);
router.post('/community', controller.submitCommunityStory);

/**
 * @swagger
 * /api/v1/relationship/poll/{pollId}/vote:
 *   post:
 *     summary: Vote on the Dilemma of the Week poll
 *     tags: [Relationship]
 *     parameters:
 *       - in: path
 *         name: pollId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [optionId]
 *             properties:
 *               optionId: { type: string }
 *     responses:
 *       200:
 *         description: Vote registered, updated results returned
 */
router.post('/poll/:pollId/vote', controller.votePoll);
router.get('/poll/active', controller.getActivePoll);

// Admin routes
router.post('/articles', authenticate, authorize('ADMIN', 'EDITOR'), controller.createArticle);
router.put('/articles/:id', authenticate, authorize('ADMIN', 'EDITOR'), controller.updateArticle);
router.delete('/articles/:id', authenticate, authorize('ADMIN'), controller.deleteArticle);
router.patch('/community/:id/approve', authenticate, authorize('ADMIN'), controller.approveCommunityStory);

module.exports = router;

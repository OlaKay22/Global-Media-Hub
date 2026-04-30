// src/modules/relationship/relationship.controller.js
const relationshipService = require('./relationship.service');

async function getArticles(req, res, next) {
  try {
    const { category, page, limit } = req.query;
    const result = await relationshipService.getArticles({ category, page, limit });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

async function getArticleBySlug(req, res, next) {
  try {
    const article = await relationshipService.getArticleBySlug(req.params.slug);
    res.json({ success: true, data: article });
  } catch (err) { next(err); }
}

async function getCommunityStories(req, res, next) {
  try {
    const data = await relationshipService.getCommunityStories();
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

async function submitCommunityStory(req, res, next) {
  try {
    const submission = await relationshipService.submitCommunityStory(req.body);
    res.status(201).json({ success: true, data: submission, message: 'Story submitted for review. Thank you!' });
  } catch (err) { next(err); }
}

async function approveCommunityStory(req, res, next) {
  try {
    const submission = await relationshipService.approveCommunityStory(req.params.id);
    res.json({ success: true, data: submission });
  } catch (err) { next(err); }
}

async function getActivePoll(req, res, next) {
  try {
    const poll = await relationshipService.getActivePoll();
    res.json({ success: true, data: poll });
  } catch (err) { next(err); }
}

async function votePoll(req, res, next) {
  try {
    const { pollId } = req.params;
    const { optionId } = req.body;
    if (!optionId) return res.status(400).json({ success: false, error: 'optionId is required.' });
    const updatedPoll = await relationshipService.votePoll(pollId, optionId);
    res.json({ success: true, data: updatedPoll });
  } catch (err) { next(err); }
}

async function createArticle(req, res, next) {
  try {
    const article = await relationshipService.createArticle(req.body);
    res.status(201).json({ success: true, data: article });
  } catch (err) { next(err); }
}

async function updateArticle(req, res, next) {
  try {
    const article = await relationshipService.updateArticle(req.params.id, req.body);
    res.json({ success: true, data: article });
  } catch (err) { next(err); }
}

async function deleteArticle(req, res, next) {
  try {
    await relationshipService.deleteArticle(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = {
  getArticles, getArticleBySlug, getCommunityStories, submitCommunityStory,
  approveCommunityStory, getActivePoll, votePoll, createArticle, updateArticle, deleteArticle,
};

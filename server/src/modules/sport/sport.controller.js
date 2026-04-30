// src/modules/sport/sport.controller.js
const sportService = require('./sport.service');

async function getArticles(req, res, next) {
  try {
    const { league, team, page, limit } = req.query;
    const result = await sportService.getArticles({ league, team, page, limit });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

async function getArticleBySlug(req, res, next) {
  try {
    const article = await sportService.getArticleBySlug(req.params.slug);
    res.json({ success: true, data: article });
  } catch (err) { next(err); }
}

async function getLeagues(req, res, next) {
  try {
    const leagues = sportService.getLeagues();
    res.json({ success: true, data: leagues });
  } catch (err) { next(err); }
}

async function getLiveScores(req, res, next) {
  try {
    const result = await sportService.getLiveScores();
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

async function createArticle(req, res, next) {
  try {
    const article = await sportService.createArticle(req.body);
    res.status(201).json({ success: true, data: article });
  } catch (err) { next(err); }
}

async function updateArticle(req, res, next) {
  try {
    const article = await sportService.updateArticle(req.params.id, req.body);
    res.json({ success: true, data: article });
  } catch (err) { next(err); }
}

async function deleteArticle(req, res, next) {
  try {
    await sportService.deleteArticle(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getArticles, getArticleBySlug, getLeagues, getLiveScores, createArticle, updateArticle, deleteArticle };

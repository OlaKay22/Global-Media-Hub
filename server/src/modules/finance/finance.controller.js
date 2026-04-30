// src/modules/finance/finance.controller.js
const financeService = require('./finance.service');

async function getArticles(req, res, next) {
  try {
    const { category, page, limit } = req.query;
    const result = await financeService.getArticles({ category, page, limit });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

async function getArticleBySlug(req, res, next) {
  try {
    const article = await financeService.getArticleBySlug(req.params.slug);
    res.json({ success: true, data: article });
  } catch (err) { next(err); }
}

async function getTicker(req, res, next) {
  try {
    const result = await financeService.getTicker();
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

async function createArticle(req, res, next) {
  try {
    const article = await financeService.createArticle(req.body);
    res.status(201).json({ success: true, data: article });
  } catch (err) { next(err); }
}

async function updateArticle(req, res, next) {
  try {
    const article = await financeService.updateArticle(req.params.id, req.body);
    res.json({ success: true, data: article });
  } catch (err) { next(err); }
}

async function deleteArticle(req, res, next) {
  try {
    await financeService.deleteArticle(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getArticles, getArticleBySlug, getTicker, createArticle, updateArticle, deleteArticle };

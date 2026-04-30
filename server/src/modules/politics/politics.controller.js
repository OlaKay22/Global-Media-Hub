// src/modules/politics/politics.controller.js
const politicsService = require('./politics.service');

async function getArticles(req, res, next) {
  try {
    const { category, region, page, limit } = req.query;
    const result = await politicsService.getArticles({ category, region, page, limit });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

async function getArticleBySlug(req, res, next) {
  try {
    const article = await politicsService.getArticleBySlug(req.params.slug);
    res.json({ success: true, data: article });
  } catch (err) { next(err); }
}

async function getPolicyUpdates(req, res, next) {
  try {
    const data = await politicsService.getPolicyUpdates();
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

async function createArticle(req, res, next) {
  try {
    const article = await politicsService.createArticle(req.body);
    res.status(201).json({ success: true, data: article });
  } catch (err) { next(err); }
}

async function updateArticle(req, res, next) {
  try {
    const article = await politicsService.updateArticle(req.params.id, req.body);
    res.json({ success: true, data: article });
  } catch (err) { next(err); }
}

async function deleteArticle(req, res, next) {
  try {
    await politicsService.deleteArticle(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getArticles, getArticleBySlug, getPolicyUpdates, createArticle, updateArticle, deleteArticle };

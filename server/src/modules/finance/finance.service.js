// src/modules/finance/finance.service.js
const prisma = require('../../config/db');
const { getCache, setCache } = require('../../config/redis');
const financeApiService = require('../../integrations/financeApi.service');
const { generateArticleJsonLd } = require('../../utils/jsonLd');

async function getArticles({ category, page = 1, limit = 12 }) {
  const skip = (page - 1) * limit;
  const where = { segment: 'FINANCE', published: true };
  if (category) where.category = category;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where, skip, take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, excerpt: true, category: true, imageUrl: true, author: true, ticker: true, createdAt: true },
    }),
    prisma.article.count({ where }),
  ]);

  return {
    data: articles,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) },
  };
}

async function getArticleBySlug(slug) {
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) { const e = new Error('Article not found'); e.statusCode = 404; throw e; }
  return { ...article, jsonLd: generateArticleJsonLd(article, 'finance') };
}

async function getTicker() {
  const cacheKey = 'finance:ticker';
  const cached = await getCache(cacheKey);
  if (cached) return { data: cached, source: 'cache' };

  const tickerData = await financeApiService.fetchTickerData();
  await setCache(cacheKey, tickerData, 60);
  return { data: tickerData, source: 'api' };
}

async function createArticle(body) {
  return prisma.article.create({ data: { ...body, segment: 'FINANCE' } });
}
async function updateArticle(id, body) {
  return prisma.article.update({ where: { id }, data: body });
}
async function deleteArticle(id) {
  return prisma.article.delete({ where: { id } });
}

module.exports = { getArticles, getArticleBySlug, getTicker, createArticle, updateArticle, deleteArticle };

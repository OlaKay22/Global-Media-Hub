// src/modules/politics/politics.service.js
const prisma = require('../../config/db');
const { generateArticleJsonLd } = require('../../utils/jsonLd');

async function getArticles({ category, region, page = 1, limit = 12 }) {
  const skip = (page - 1) * limit;
  const where = { segment: 'POLITICS', published: true };
  if (category) where.category = category;
  if (region) where.region = region;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where, skip, take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, slug: true, excerpt: true,
        category: true, imageUrl: true, author: true,
        region: true, policyArea: true, createdAt: true,
      },
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
  return { ...article, jsonLd: generateArticleJsonLd(article, 'politics') };
}

async function getPolicyUpdates() {
  return prisma.article.findMany({
    where: { segment: 'POLITICS', category: 'policy-update', published: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: { id: true, title: true, slug: true, excerpt: true, policyArea: true, createdAt: true },
  });
}

async function createArticle(body) {
  return prisma.article.create({ data: { ...body, segment: 'POLITICS' } });
}
async function updateArticle(id, body) {
  return prisma.article.update({ where: { id }, data: body });
}
async function deleteArticle(id) {
  return prisma.article.delete({ where: { id } });
}

module.exports = { getArticles, getArticleBySlug, getPolicyUpdates, createArticle, updateArticle, deleteArticle };

// src/modules/relationship/relationship.service.js
const prisma = require('../../config/db');
const { generateArticleJsonLd } = require('../../utils/jsonLd');

async function getArticles({ category, page = 1, limit = 12 }) {
  const skip = (page - 1) * limit;
  const where = { segment: 'RELATIONSHIP', published: true };
  if (category) where.category = category;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where, skip, take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, excerpt: true, category: true, imageUrl: true, author: true, isUserStory: true, createdAt: true },
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
  return { ...article, jsonLd: generateArticleJsonLd(article, 'relationship') };
}

async function getCommunityStories() {
  return prisma.communitySubmission.findMany({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });
}

async function submitCommunityStory(body) {
  const { name, email, title, story } = body;
  return prisma.communitySubmission.create({
    data: { name, email, title, story, approved: false },
  });
}

async function approveCommunityStory(id) {
  return prisma.communitySubmission.update({ where: { id }, data: { approved: true } });
}

async function getActivePoll() {
  return prisma.poll.findFirst({
    where: { active: true },
    include: { options: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function votePoll(pollId, optionId) {
  // Increment vote count atomically
  await prisma.pollOption.update({
    where: { id: optionId, pollId },
    data: { votes: { increment: 1 } },
  });

  // Return the updated poll with all options
  return prisma.poll.findUnique({
    where: { id: pollId },
    include: { options: { orderBy: { votes: 'desc' } } },
  });
}

async function createArticle(body) {
  return prisma.article.create({ data: { ...body, segment: 'RELATIONSHIP' } });
}
async function updateArticle(id, body) {
  return prisma.article.update({ where: { id }, data: body });
}
async function deleteArticle(id) {
  return prisma.article.delete({ where: { id } });
}

module.exports = {
  getArticles, getArticleBySlug, getCommunityStories, submitCommunityStory,
  approveCommunityStory, getActivePoll, votePoll, createArticle, updateArticle, deleteArticle,
};

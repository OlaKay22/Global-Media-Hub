// src/modules/sport/sport.service.js
const prisma = require('../../config/db');
const { getCache, setCache } = require('../../config/redis');
const sportsApiService = require('../../integrations/sportsApi.service');
const { generateArticleJsonLd } = require('../../utils/jsonLd');

const LEAGUES = {
  'premier-league': {
    name: 'Premier League',
    country: 'England',
    teams: [
      'Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton',
      'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Ipswich Town',
      'Leicester City', 'Liverpool', 'Manchester City', 'Manchester United',
      'Newcastle United', 'Nottingham Forest', 'Southampton', 'Tottenham',
      'West Ham', 'Wolverhampton',
    ],
  },
  'la-liga': {
    name: 'La Liga',
    country: 'Spain',
    teams: [
      'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla', 'Real Sociedad',
      'Real Betis', 'Athletic Bilbao', 'Valencia', 'Villarreal', 'Celta Vigo',
    ],
  },
  'serie-a': {
    name: 'Serie A',
    country: 'Italy',
    teams: [
      'AC Milan', 'Inter Milan', 'Juventus', 'Napoli', 'Roma',
      'Lazio', 'Atalanta', 'Fiorentina', 'Torino', 'Sassuolo',
    ],
  },
  'bundesliga': {
    name: 'Bundesliga',
    country: 'Germany',
    teams: [
      'Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen',
      'Wolfsburg', 'Eintracht Frankfurt', 'Borussia Monchengladbach', 'Hoffenheim',
    ],
  },
  'ligue-1': {
    name: 'Ligue 1',
    country: 'France',
    teams: [
      'Paris Saint-Germain', 'Marseille', 'Lyon', 'Monaco', 'Lille',
      'Nice', 'Rennes', 'Lens', 'Montpellier', 'Strasbourg',
    ],
  },
};

/**
 * Fetch paginated articles from the database with optional filtering.
 */
async function getArticles({ league, team, page = 1, limit = 12 }) {
  const skip = (page - 1) * limit;
  const where = { segment: 'SPORT', published: true };

  if (league) where.league = league;
  if (team) where.teamSlug = team;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, slug: true, excerpt: true,
        category: true, imageUrl: true, author: true,
        league: true, teamSlug: true, createdAt: true,
      },
    }),
    prisma.article.count({ where }),
  ]);

  return {
    data: articles,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) },
  };
}

/**
 * Fetch a single article by slug, enrich with JSON-LD metadata.
 */
async function getArticleBySlug(slug) {
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) {
    const err = new Error('Article not found');
    err.statusCode = 404;
    throw err;
  }
  const jsonLd = generateArticleJsonLd(article, 'sport');
  return { ...article, jsonLd };
}

/**
 * Return the static league/team data object.
 */
function getLeagues() {
  return LEAGUES;
}

/**
 * Fetch live scores. Caches for 60 seconds in Redis.
 */
async function getLiveScores() {
  const cacheKey = 'sport:live_scores';
  const cached = await getCache(cacheKey);
  if (cached) return { data: cached, source: 'cache' };

  const liveData = await sportsApiService.fetchLiveMatches();
  await setCache(cacheKey, liveData, 60);
  return { data: liveData, source: 'api' };
}

async function createArticle(body) {
  return prisma.article.create({ data: { ...body, segment: 'SPORT' } });
}

async function updateArticle(id, body) {
  return prisma.article.update({ where: { id }, data: body });
}

async function deleteArticle(id) {
  return prisma.article.delete({ where: { id } });
}

module.exports = {
  getArticles, getArticleBySlug, getLeagues,
  getLiveScores, createArticle, updateArticle, deleteArticle,
};

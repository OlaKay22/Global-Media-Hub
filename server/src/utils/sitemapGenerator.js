// src/utils/sitemapGenerator.js
// Run with: npm run sitemap
// Generates a sitemap.xml from all published articles in the database.

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const SITE_URL = process.env.SITE_BASE_URL || 'https://www.globalmediahub.com';
const OUTPUT_PATH = path.resolve(__dirname, '../../public/sitemap.xml');

const SEGMENT_PATHS = {
  SPORT: 'sport',
  FINANCE: 'finance',
  POLITICS: 'politics',
  RELATIONSHIP: 'relationships',
};

const STATIC_PAGES = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/sport', changefreq: 'hourly', priority: '0.9' },
  { url: '/finance', changefreq: 'hourly', priority: '0.9' },
  { url: '/politics', changefreq: 'daily', priority: '0.9' },
  { url: '/relationships', changefreq: 'daily', priority: '0.9' },
  { url: '/sport/premier-league', changefreq: 'daily', priority: '0.8' },
  { url: '/sport/la-liga', changefreq: 'daily', priority: '0.8' },
  { url: '/sport/serie-a', changefreq: 'daily', priority: '0.8' },
  { url: '/sport/bundesliga', changefreq: 'daily', priority: '0.8' },
  { url: '/sport/ligue-1', changefreq: 'daily', priority: '0.8' },
  { url: '/finance/personal-finance', changefreq: 'weekly', priority: '0.7' },
  { url: '/finance/global-trends', changefreq: 'weekly', priority: '0.7' },
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildUrlEntry({ loc, lastmod, changefreq, priority }) {
  return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`.trim();
}

async function generateSitemap() {
  console.log('🗺️  Generating sitemap...');

  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, segment: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });

  const staticEntries = STATIC_PAGES.map((page) =>
    buildUrlEntry({
      loc: `${SITE_URL}${page.url}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority,
    })
  );

  const articleEntries = articles.map((article) => {
    const segmentPath = SEGMENT_PATHS[article.segment] || 'news';
    return buildUrlEntry({
      loc: `${SITE_URL}/${segmentPath}/${article.slug}`,
      lastmod: article.updatedAt.toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.6',
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${[...staticEntries, ...articleEntries].join('\n')}
</urlset>`;

  // Ensure output directory exists
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
  console.log(`✅  Sitemap written to: ${OUTPUT_PATH}`);
  console.log(`   Static pages : ${staticEntries.length}`);
  console.log(`   Article URLs : ${articleEntries.length}`);
  console.log(`   Total URLs   : ${staticEntries.length + articleEntries.length}`);

  await prisma.$disconnect();
}

generateSitemap().catch(async (err) => {
  console.error('❌  Sitemap generation failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});

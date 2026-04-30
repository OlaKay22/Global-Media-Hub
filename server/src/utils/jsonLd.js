// src/utils/jsonLd.js — JSON-LD Structured Data Generator
// Automatically builds schema.org metadata for each article type.

const SITE_URL = process.env.SITE_BASE_URL || 'https://www.globalmediahub.com';

/**
 * Generates a JSON-LD NewsArticle schema for a given article.
 * @param {object} article - Prisma article object
 * @param {string} segment - 'sport' | 'finance' | 'politics' | 'relationship'
 * @returns {object} JSON-LD structured data object
 */
function generateArticleJsonLd(article, segment) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt || '',
    image: article.imageUrl ? [article.imageUrl] : [],
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Global Media Hub',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: article.createdAt?.toISOString?.() || new Date().toISOString(),
    dateModified: article.updatedAt?.toISOString?.() || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${segment}/${article.slug}`,
    },
    url: `${SITE_URL}/${segment}/${article.slug}`,
    articleSection: article.category,
    keywords: buildKeywords(article, segment),
  };
}

/**
 * Generates JSON-LD for the Breadcrumb navigation trail.
 * @param {Array<{name: string, url: string}>} breadcrumbs
 */
function generateBreadcrumbJsonLd(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.url}`,
    })),
  };
}

/**
 * Builds a keyword string based on segment-specific fields.
 */
function buildKeywords(article, segment) {
  const base = ['Global Media Hub', article.category, segment];
  if (segment === 'sport' && article.league) base.push(article.league);
  if (segment === 'politics' && article.region) base.push(article.region);
  if (segment === 'finance' && article.ticker) base.push(article.ticker);
  return base.filter(Boolean).join(', ');
}

module.exports = { generateArticleJsonLd, generateBreadcrumbJsonLd };

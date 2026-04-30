// src/middleware/slugify.js — Auto-slug generation middleware
const slugifyLib = require('slugify');

/**
 * Intercepts POST and PUT requests. If the body contains a `title` field
 * and no `slug` is already provided, auto-generates one.
 *
 * Example: "My First Article" → "my-first-article"
 */
function slugMiddleware(req, res, next) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body?.title && !req.body?.slug) {
    req.body.slug = slugifyLib(req.body.title, {
      lower: true,
      strict: true,  // Removes special characters
      trim: true,
    });
  }
  next();
}

module.exports = slugMiddleware;

// src/middleware/errorHandler.js — Global error handler
/**
 * Catches all errors passed via next(err). Returns a consistent
 * JSON error response without leaking stack traces in production.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || err.status || 500;
  const isDev = process.env.NODE_ENV !== 'production';

  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  // Prisma known request errors (e.g., unique constraint violations)
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: `Conflict: A record with this ${err.meta?.target?.join(', ')} already exists.`,
    });
  }

  // Prisma not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'Record not found.',
    });
  }

  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
}

module.exports = errorHandler;

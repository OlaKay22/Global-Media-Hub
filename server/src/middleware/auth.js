// src/middleware/auth.js — JWT authentication middleware
const jwt = require('jsonwebtoken');

/**
 * Protects routes requiring admin/authenticated access.
 * Reads a Bearer token from the Authorization header and verifies it.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired.' });
    }
    return res.status(403).json({ success: false, error: 'Invalid token.' });
  }
}

/**
 * Restricts access to specific roles (e.g., 'ADMIN', 'EDITOR').
 * Must be used AFTER `authenticate`.
 * @param {...string} roles - Allowed role strings
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Insufficient permissions.',
      });
    }
    next();
  };
}

module.exports = { authenticate, authorize };

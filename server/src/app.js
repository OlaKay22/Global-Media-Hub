// src/app.js — Express application bootstrap
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');
const slugMiddleware = require('./middleware/slugify');

// --- Routers ---
const sportRouter = require('./modules/sport/sport.routes');
const financeRouter = require('./modules/finance/finance.routes');
const politicsRouter = require('./modules/politics/politics.routes');
const relationshipRouter = require('./modules/relationship/relationship.routes');

const app = express();

// =============================================
//  SECURITY MIDDLEWARE
// =============================================
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// =============================================
//  GLOBAL RATE LIMITING
// =============================================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use('/api', globalLimiter);

// =============================================
//  GENERAL MIDDLEWARE
// =============================================
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auto-slug middleware for POST/PUT requests with a `title` field
app.use(slugMiddleware);

// =============================================
//  SWAGGER API DOCS
// =============================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Global Media Hub API',
  customCss: '.swagger-ui .topbar { background-color: #0B192C; }',
}));

// =============================================
//  HEALTH CHECK
// =============================================
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// =============================================
//  API ROUTES  /api/v1/
// =============================================
app.use('/api/v1/sport', sportRouter);
app.use('/api/v1/finance', financeRouter);
app.use('/api/v1/politics', politicsRouter);
app.use('/api/v1/relationship', relationshipRouter);

// =============================================
//  404 HANDLER
// =============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// =============================================
//  GLOBAL ERROR HANDLER
// =============================================
app.use(errorHandler);

module.exports = app;

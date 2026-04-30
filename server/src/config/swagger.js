// src/config/swagger.js — Swagger/OpenAPI definition
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Global Media Hub API',
      version: '1.0.0',
      description:
        'RESTful API for the Global Media Hub platform. Covers Sport, Finance, Politics, and Relationship segments.',
      contact: {
        name: 'Global Media Hub Dev Team',
        url: process.env.SITE_BASE_URL,
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development Server',
      },
      {
        url: process.env.SITE_BASE_URL || 'https://api.globalmediahub.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Article: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            slug: { type: 'string' },
            excerpt: { type: 'string' },
            content: { type: 'string' },
            segment: {
              type: 'string',
              enum: ['SPORT', 'FINANCE', 'POLITICS', 'RELATIONSHIP'],
            },
            category: { type: 'string' },
            imageUrl: { type: 'string' },
            author: { type: 'string' },
            published: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  // Scan all route files for JSDoc @swagger annotations
  apis: ['./src/modules/**/*.routes.js'],
};

module.exports = swaggerJsdoc(options);

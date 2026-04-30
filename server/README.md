# Global Media Hub — Backend Server

A production-grade REST API built with **Node.js + Express**, **PostgreSQL (Prisma)**, and **Redis** caching.

## Prerequisites
- Node.js v20+
- PostgreSQL (local or hosted, e.g. Supabase/Railway)
- Redis (local or hosted, e.g. Upstash)

## Quick Start

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL, Redis, API keys, etc.
```

### 3. Set up the database
```bash
# Runs migrations and generates the Prisma client
npm run db:migrate
```

### 4. Start the development server
```bash
npm run dev
```

The server starts at **http://localhost:5000**

| Endpoint | Description |
|---|---|
| `GET /health` | Health check |
| `GET /api-docs` | Swagger UI |
| `GET /api/v1/sport/articles` | Sport articles |
| `GET /api/v1/sport/live` | Live scores (Redis cached) |
| `GET /api/v1/sport/leagues` | All leagues + teams |
| `GET /api/v1/finance/articles` | Finance articles |
| `GET /api/v1/finance/ticker` | Live market ticker (Redis cached) |
| `GET /api/v1/politics/articles` | Politics articles |
| `GET /api/v1/politics/policy-updates` | TL;DR policy cards |
| `GET /api/v1/relationship/articles` | Relationship articles |
| `GET /api/v1/relationship/community` | Community stories |
| `POST /api/v1/relationship/community` | Submit a community story |
| `GET /api/v1/relationship/poll/active` | Active poll |
| `POST /api/v1/relationship/poll/:id/vote` | Vote on a poll |

## Generating the Sitemap
```bash
npm run sitemap
# Output: server/public/sitemap.xml
```

## API Keys Required
| Key | Used For | Where to Get |
|---|---|---|
| `API_SPORTS_KEY` | Live football scores | [api-sports.io](https://api-sports.io) |
| `FMP_API_KEY` | S&P 500 / FTSE 100 | [financialmodelingprep.com](https://financialmodelingprep.com) |
| `YOUTUBE_API_KEY` | Watch section videos | [Google Cloud Console](https://console.cloud.google.com) |
| `CLOUDINARY_*` | Image uploads | [cloudinary.com](https://cloudinary.com) |

> All integrations gracefully fall back to mock data if keys are missing, so the server boots without any keys during development.

## Security Features
- **Helmet.js** — HTTP header hardening
- **CORS** — Origin restricted to `FRONTEND_URL`
- **Rate Limiting** — 300 req / 15 min per IP on `/api`
- **JWT Auth** — Bearer token on all write routes
- **Role-Based Access** — `ADMIN` and `EDITOR` roles

## Directory Structure
```
server/
├── prisma/schema.prisma       # DB models
├── src/
│   ├── app.js                 # Express bootstrap
│   ├── config/                # DB, Redis, Swagger
│   ├── middleware/            # Auth, slugify, errorHandler
│   ├── modules/               # sport / finance / politics / relationship
│   │   └── [module]/
│   │       ├── *.routes.js
│   │       ├── *.controller.js
│   │       └── *.service.js
│   ├── integrations/          # External API services
│   ├── uploads/               # Multer + Cloudinary
│   └── utils/                 # jsonLd, sitemapGenerator
├── .env.example
├── package.json
└── server.js
```

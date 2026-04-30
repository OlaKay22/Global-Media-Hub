// server.js — HTTP server entry point
require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Global Media Hub API running on port ${PORT}`);
  console.log(`   Mode        : ${process.env.NODE_ENV}`);
  console.log(`   Docs        : http://localhost:${PORT}/api-docs`);
  console.log(`   Health      : http://localhost:${PORT}/health\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
    process.exit(0);
  });
});

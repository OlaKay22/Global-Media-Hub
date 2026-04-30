// src/config/redis.js — ioredis client with connection handling
const Redis = require('ioredis');

let redisClient;

try {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => {
      if (times > 5) {
        console.warn('⚠️  Redis: Max retries reached. Running without cache.');
        return null; // Stop retrying
      }
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  redisClient.on('connect', () => console.log('✅  Redis connected'));
  redisClient.on('error', (err) => console.warn(`⚠️  Redis error: ${err.message}`));

  redisClient.connect().catch(() => {});
} catch (e) {
  console.warn('⚠️  Redis client failed to initialize. Cache disabled.');
  redisClient = null;
}

/**
 * Get a cached value. Returns null if cache miss or Redis is unavailable.
 * @param {string} key
 */
async function getCache(key) {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Set a cached value with a TTL (time-to-live) in seconds.
 * @param {string} key
 * @param {*} value
 * @param {number} ttlSeconds
 */
async function setCache(key, value, ttlSeconds = 60) {
  if (!redisClient) return;
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    // Silently fail — cache is not mission-critical
  }
}

module.exports = { redisClient, getCache, setCache };

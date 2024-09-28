import express from 'express';
import redis from 'redis';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// Create a Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
  // TODO: Implement proper error handling and logging
});

/**
 * Creates and configures the rate limiting middleware
 * @returns {express.RequestHandler} Express middleware function for rate limiting
 */
export const rateLimiterMiddleware = (): express.RequestHandler => {
  const limiter = rateLimit({
    store: new RedisStore({
      client: redisClient,
      prefix: 'rate_limit:',
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  return limiter;
};

// Export the middleware function
export default rateLimiterMiddleware;

// TODO: Configure Redis connection details in the environment variables
// TODO: Review and adjust rate limiting parameters based on the specific requirements and expected traffic of the Mint Replica application
// TODO: Implement error handling for Redis connection failures
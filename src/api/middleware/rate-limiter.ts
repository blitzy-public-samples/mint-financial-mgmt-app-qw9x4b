import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

// Assuming we have a redis configuration file that exports a createRedisClient function
// If not, we'll create a simple redis client here
const createRedisClient = () => {
  return new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  });
};

// Global constants for rate limiting
const MAX_REQUESTS_PER_WINDOW = 100;
const WINDOW_MS = 900000; // 15 minutes in milliseconds

/**
 * Creates and configures the rate limiter middleware
 * @returns Configured rate limiter middleware
 */
const createRateLimiter = () => {
  const redisClient = createRedisClient();

  const limiter = rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.call(...args),
    }),
    max: MAX_REQUESTS_PER_WINDOW,
    windowMs: WINDOW_MS,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
  });

  return limiter;
};

/**
 * Express middleware function for rate limiting
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const limiter = createRateLimiter();
  limiter(req, res, (err: any) => {
    if (err) {
      res.status(429).json({ error: 'Too Many Requests' });
    } else {
      next();
    }
  });
};

// List of human tasks as comments
/*
Human tasks:
1. Fine-tune the MAX_REQUESTS_PER_WINDOW and WINDOW_MS values based on expected API usage patterns (Required)
2. Implement IP-based rate limiting or user-based rate limiting depending on the authentication strategy (Required)
3. Add logging for rate limit violations to monitor potential abuse (Optional)
4. Consider implementing different rate limits for various API endpoints based on their resource intensity (Optional)
*/
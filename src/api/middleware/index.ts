/**
 * This file serves as the main entry point for exporting all middleware functions
 * used in the Mint Replica API. It aggregates and re-exports middleware from
 * individual files to provide a centralized import location for the application.
 */

import { authMiddleware } from './auth';
import { errorHandlerMiddleware } from './error-handler';
import { rateLimiterMiddleware } from './rate-limiter';
import { validationMiddleware } from './validation';

export {
  authMiddleware,
  errorHandlerMiddleware,
  rateLimiterMiddleware,
  validationMiddleware,
};

/**
 * Human Tasks:
 * 1. Implement the individual middleware files (auth.ts, error-handler.ts, rate-limiter.ts, validation.ts)
 * 2. Ensure that each middleware file exports its respective middleware function with the correct name
 * 3. Review and adjust the middleware implementations to meet the specific security and performance requirements of the Mint Replica application
 */
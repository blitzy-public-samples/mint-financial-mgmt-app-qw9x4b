// This file serves as the main entry point for all middleware used in the Mint Replica backend application.
// It exports middleware functions to be used in the Express.js application.

// Import middleware functions
import { authMiddleware } from './auth.middleware';
import { errorMiddleware } from './error.middleware';
import { validationMiddleware } from './validation.middleware';
import { rateLimiterMiddleware } from './rateLimiter.middleware';

// Export middleware functions
export {
  authMiddleware,
  errorMiddleware,
  validationMiddleware,
  rateLimiterMiddleware
};

// TODO: Implement the individual middleware files:
// - auth.middleware.ts
// - error.middleware.ts
// - validation.middleware.ts
// - rateLimiter.middleware.ts

// TODO: Review and adjust the exported middleware functions based on the specific requirements of the Mint Replica application
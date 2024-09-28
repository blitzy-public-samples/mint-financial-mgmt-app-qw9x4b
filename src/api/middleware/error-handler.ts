import { Request, Response, NextFunction } from 'express';

// TODO: Implement logger utility in src/api/utils/logger.ts
// import { logger } from '../utils/logger';

// TODO: Move this type to src/shared/types/index.ts
interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // TODO: Implement logger utility and uncomment the following line
  // logger.error(`Error: ${error.message}`, { stack: error.stack });

  const statusCode = (error as ApiError).statusCode || 500;
  const message = error.message || 'Internal Server Error';

  const errorResponse = {
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  };

  res.status(statusCode).json(errorResponse);
};

// List of human tasks
/**
 * TODO: Human Tasks
 * 1. Implement the logger utility in src/api/utils/logger.ts
 * 2. Define the ApiError type in src/shared/types/index.ts
 * 3. Review and adjust error messages to ensure they are user-friendly and don't expose sensitive information
 * 4. Set up proper error monitoring and alerting system for production environment
 */
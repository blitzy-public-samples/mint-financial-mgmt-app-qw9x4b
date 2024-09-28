import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

// Define the CustomError class
export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Define the error middleware function
export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error(`Error: ${error.message}`, { stack: error.stack });

  // Determine the status code
  const statusCode = error instanceof CustomError ? error.statusCode : 500;

  // Create the error response object
  const errorResponse = {
    success: false,
    error: {
      message: error.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  };

  // Send the error response to the client
  res.status(statusCode).json(errorResponse);
};

// Human tasks (commented)
/*
TODO: Review and customize error messages for different types of errors
TODO: Implement error monitoring and alerting system integration
TODO (Optional): Create documentation for custom error codes and their meanings
*/
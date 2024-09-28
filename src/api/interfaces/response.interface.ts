import { Response } from 'express';

/**
 * Represents the structure of a successful API response
 */
export type SuccessResponse = {
  success: true;
  message: string;
  data: any;
};

/**
 * Represents the structure of an error API response
 */
export type ErrorResponse = {
  success: false;
  message: string;
  error: string;
};

/**
 * Extends the Express Response interface to include custom properties and methods for the Mint Replica application
 */
export interface ResponseInterface extends Response {
  locals: Record<string, any>;

  /**
   * Sends a successful response with standardized format
   * @param data - The data to be sent in the response
   * @param message - A message describing the successful operation
   * @param statusCode - The HTTP status code (default: 200)
   */
  sendSuccess(data: any, message: string, statusCode?: number): void;

  /**
   * Sends an error response with standardized format
   * @param error - The error object or message
   * @param statusCode - The HTTP status code (default: 500)
   */
  sendError(error: Error | string, statusCode?: number): void;
}

// List of human tasks (commented as requested)
/**
 * Human tasks:
 * 1. Verify that the ResponseInterface includes all necessary properties and methods for the Mint Replica application
 * 2. Ensure that the SuccessResponse and ErrorResponse types align with the actual response formats used in the application
 * 3. Review and potentially implement additional response methods for specific use cases in the Mint Replica application
 */
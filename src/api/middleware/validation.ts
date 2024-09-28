import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { isValidEmail, isValidPassword, isValidCurrencyAmount, isValidDate, isValidPhoneNumber } from '../../shared/utils/validation';

/**
 * Higher-order function that returns a middleware function to validate request data against a Joi schema
 * @param schema - Joi schema to validate against
 * @returns Express middleware function
 */
export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: 'Validation failed', details: errorMessage });
    }
    next();
  };
};

/**
 * Middleware function to validate the request body
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const validateRequestBody = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is missing or empty' });
  }
  next();
};

/**
 * Middleware function to validate query parameters
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const validateQueryParams = (req: Request, res: Response, next: NextFunction) => {
  const allowedParams = ['page', 'limit', 'sort', 'filter']; // Add or remove allowed parameters as needed
  const invalidParams = Object.keys(req.query).filter(param => !allowedParams.includes(param));

  if (invalidParams.length > 0) {
    return res.status(400).json({ error: 'Invalid query parameters', invalidParams });
  }
  next();
};

// Export the imported validation functions for use in other parts of the application
export { isValidEmail, isValidPassword, isValidCurrencyAmount, isValidDate, isValidPhoneNumber };

// TODO: Implement specific validation schemas for different API endpoints (e.g., user registration, transaction creation)
// TODO: Add custom error messages for validation failures
// TODO: Implement additional validation middleware functions as needed for specific API requirements
// TODO: Create unit tests for the validation middleware functions
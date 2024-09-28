import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import joi from 'joi';

/**
 * Validates incoming request data against a provided Joi schema
 * @param schema - Joi schema to validate against
 * @returns Express middleware function
 */
export const validationMiddleware = (schema: joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      { abortEarly: false }
    );

    if (error) {
      const validationError = new ValidationError(
        'Validation failed',
        error.details,
        error._original
      );
      return next(validationError);
    }

    next();
  };
};

// Helper function to validate schema
const validateSchema = (data: any, schema: joi.ObjectSchema): ValidationError | null => {
  const { error } = schema.validate(data, { abortEarly: false });
  return error || null;
};

export { validateSchema };

/**
 * TODO: Implement error handling for different types of validation errors (e.g., required fields, invalid formats)
 * TODO: Add unit tests for the validation middleware to ensure it correctly handles various scenarios
 * TODO: Consider implementing custom error messages for improved user experience
 */
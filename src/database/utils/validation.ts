import Joi from 'joi';

/**
 * Validates input data against a specified schema
 * @param data The data to be validated
 * @param schema The Joi schema to validate against
 * @returns Validation result containing any errors or the validated data
 */
export const validateDatabaseInput = (data: any, schema: Joi.Schema): Joi.ValidationResult => {
  return schema.validate(data, { abortEarly: false });
};

/**
 * Checks if a given string is a valid UUID
 * @param uuid The string to be checked
 * @returns True if the string is a valid UUID, false otherwise
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
};

/**
 * Checks if a given string is a valid email address
 * @param email The string to be checked
 * @returns True if the string is a valid email address, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Checks if a given string is a valid date in ISO 8601 format
 * @param dateString The string to be checked
 * @returns True if the string is a valid date, false otherwise
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString() === dateString;
};

/**
 * Sanitizes input strings to prevent SQL injection and other malicious inputs
 * @param input The string to be sanitized
 * @returns Sanitized input string
 */
export const sanitizeInput = (input: string): string => {
  // Remove any potentially harmful characters or SQL keywords
  const sanitized = input.replace(/['";\\%]/g, '');
  
  // Escape special characters
  return sanitized.replace(/[&<>'"]/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case "'": return '&#39;';
      case '"': return '&quot;';
      default: return char;
    }
  });
};

// List of human tasks
/**
 * Human tasks:
 * 1. Review and approve the validation functions and their implementations
 * 2. Determine if additional database-specific validation functions are needed
 */
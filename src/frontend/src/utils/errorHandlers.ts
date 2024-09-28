import { ErrorMessages } from '../constants/errorMessages';
import { handleApiError } from '../services/api';

/**
 * Main error handling function that processes different types of errors and returns user-friendly messages
 * @param error - The error object or unknown error
 * @returns A user-friendly error message
 */
export const handleError = (error: Error | unknown): string => {
  // Check if error is an instance of Error
  if (error instanceof Error) {
    // If it's an API error, use handleApiError function
    if ('response' in error) {
      return handleApiError(error);
    }

    // If it's a known error type, return corresponding error message
    if (error.name in ErrorMessages) {
      return ErrorMessages[error.name as keyof typeof ErrorMessages];
    }

    // For unknown errors, return a generic error message
    return ErrorMessages.GENERIC_ERROR;
  }

  // Log the error for debugging purposes
  console.error('Unhandled error:', error);

  // Return a generic error message for unknown error types
  return ErrorMessages.GENERIC_ERROR;
};

/**
 * Logs errors for debugging and monitoring purposes
 * @param error - The error object or unknown error
 * @param context - Additional context information
 */
export const logError = (error: Error | unknown, context: string): void => {
  // Format error details including stack trace if available
  const errorDetails = error instanceof Error
    ? `${error.name}: ${error.message}\nStack: ${error.stack}`
    : String(error);

  // Add context information to the log
  const logMessage = `[${context}] ${errorDetails}`;

  // Use console.error for development environment
  if (process.env.NODE_ENV === 'development') {
    console.error(logMessage);
  } else {
    // In production, send error logs to a centralized logging service
    // TODO: Implement integration with a centralized error logging service for production environment
    console.error('Production error:', logMessage);
  }
};

/**
 * Displays error messages to the user in a user-friendly format
 * @param errorMessage - The error message to display
 */
export const displayErrorToUser = (errorMessage: string): void => {
  // TODO: Create a global error display component for consistent error presentation across the application
  // Check if a global error display component is available
  if (typeof globalThis.showErrorNotification === 'function') {
    // If available, use the global component to display the error
    globalThis.showErrorNotification(errorMessage);
  } else {
    // If not, use a fallback method (e.g., alert) to show the error message
    alert(errorMessage);
  }
};

/**
 * Checks if the given error is a network-related error
 * @param error - The error object or unknown error
 * @returns True if it's a network error, false otherwise
 */
export const isNetworkError = (error: Error | unknown): boolean => {
  // Check if error is an instance of TypeError
  if (error instanceof TypeError) {
    // Check if error message contains network-related keywords
    const networkErrorKeywords = ['network', 'internet', 'offline', 'connection'];
    return networkErrorKeywords.some(keyword => error.message.toLowerCase().includes(keyword));
  }

  // Return false for non-TypeError errors
  return false;
};

// Human tasks:
// TODO: Implement integration with a centralized error logging service for production environment
// TODO: Create a global error display component for consistent error presentation across the application
// TODO: Define and implement specific error types for different scenarios in the application
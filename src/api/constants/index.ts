// Import all error messages
import * as ErrorMessages from './error-messages';

// Import all success messages
import * as SuccessMessages from './success-messages';

// Export error and success messages
export { ErrorMessages, SuccessMessages };

// API version
export const API_VERSION = '1.0.0';

// Default number of items per page for paginated responses
export const DEFAULT_PAGE_SIZE = 20;

// Maximum allowed number of items per page for paginated responses
export const MAX_PAGE_SIZE = 100;

// Default currency used in the application
export const DEFAULT_CURRENCY = 'USD';

// Standard date format used across the application
export const DATE_FORMAT = 'YYYY-MM-DD';

// Standard datetime format used across the application
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// Human tasks
/**
 * TODO: Review and update API_VERSION constant when releasing new API versions
 * TODO: Ensure DEFAULT_CURRENCY aligns with the primary user base or allow user-specific currency settings
 */
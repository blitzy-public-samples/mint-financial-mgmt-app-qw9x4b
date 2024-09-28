import dotenv from 'dotenv';

// Load environment variables from .env file
export const loadEnv = (): void => {
  dotenv.config();
  console.log('Environment variables loaded');
};

// Environment
export const NODE_ENV = process.env.NODE_ENV || 'development';

// API Configuration
export const ML_API_PORT = Number(process.env.ML_API_PORT) || 5000;

// Database Configuration
export const DATABASE_URL = process.env.DATABASE_URL;

// Model Storage Configuration
export const MODEL_STORAGE_PATH = process.env.MODEL_STORAGE_PATH || './models';

// Logging Configuration
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Import model configurations
// Note: The actual implementation of modelConfig is not available,
// so we're exporting it as is. It should be implemented in the ./model_config file.
import * as modelConfig from './model_config';

export { modelConfig };

// Export all configurations
export {
  NODE_ENV,
  ML_API_PORT,
  DATABASE_URL,
  MODEL_STORAGE_PATH,
  LOG_LEVEL,
  loadEnv
};

// Human tasks (commented as requested)
/*
Human tasks:
1. Review and update environment variable names and default values
2. Ensure all necessary configuration options for ML services are included
3. Implement proper error handling for missing critical environment variables
*/
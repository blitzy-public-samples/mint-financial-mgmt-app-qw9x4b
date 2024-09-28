import dotenv from 'dotenv';
import databaseConfig from './database';
import redisConfig from './redis';
import loggerConfig from './logger';
import swaggerConfig from './swagger';

// Load environment variables from .env file
const loadEnv = (): void => {
  dotenv.config();
  console.log('Environment variables loaded');
};

// Load environment variables
loadEnv();

// Define the NODE_ENV
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create the config object
const config = {
  env: NODE_ENV,
  database: databaseConfig,
  redis: redisConfig,
  logger: loggerConfig,
  swagger: swaggerConfig,
};

export default config;

// List of human tasks
/**
 * TODO: Human Tasks
 * 1. Review and adjust configuration settings for each environment (development, staging, production)
 * 2. Ensure all necessary environment variables are documented and included in .env.example
 */
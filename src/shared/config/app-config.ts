// Core application configuration settings for the Mint Replica application

// Environment variables (to be replaced with actual values in a secure manner)
const BASE_API_URL = process.env.BASE_API_URL || 'http://localhost:3000/api';
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID || '';
const PLAID_SECRET = process.env.PLAID_SECRET || '';
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1d';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mint_replica';
const POSTGRESQL_URI = process.env.POSTGRESQL_URI || 'postgresql://user:password@localhost:5432/mint_replica';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const SENTRY_DSN = process.env.SENTRY_DSN || '';
const CREDIT_SCORE_API_KEY = process.env.CREDIT_SCORE_API_KEY || '';
const INVESTMENT_DATA_API_KEY = process.env.INVESTMENT_DATA_API_KEY || '';

// Interface defining the structure of the application configuration
interface AppConfig {
  apiUrl: string;
  plaid: {
    clientId: string;
    secret: string;
    env: string;
  };
  auth: {
    jwtSecret: string;
    jwtExpiration: string;
  };
  database: {
    redisUrl: string;
    mongodbUri: string;
    postgresqlUri: string;
  };
  logging: {
    level: string;
    sentryDsn: string;
  };
  externalApis: {
    creditScoreApiKey: string;
    investmentDataApiKey: string;
  };
}

// Configuration settings for the development environment
const developmentConfig: AppConfig = {
  apiUrl: BASE_API_URL,
  plaid: {
    clientId: PLAID_CLIENT_ID,
    secret: PLAID_SECRET,
    env: PLAID_ENV,
  },
  auth: {
    jwtSecret: JWT_SECRET,
    jwtExpiration: JWT_EXPIRATION,
  },
  database: {
    redisUrl: REDIS_URL,
    mongodbUri: MONGODB_URI,
    postgresqlUri: POSTGRESQL_URI,
  },
  logging: {
    level: LOG_LEVEL,
    sentryDsn: SENTRY_DSN,
  },
  externalApis: {
    creditScoreApiKey: CREDIT_SCORE_API_KEY,
    investmentDataApiKey: INVESTMENT_DATA_API_KEY,
  },
};

// Configuration settings for the staging environment
const stagingConfig: AppConfig = {
  ...developmentConfig,
  // Override any specific settings for staging environment
};

// Configuration settings for the production environment
const productionConfig: AppConfig = {
  ...developmentConfig,
  // Override any specific settings for production environment
  logging: {
    ...developmentConfig.logging,
    level: 'error', // Set stricter logging for production
  },
};

/**
 * Returns the configuration object for the specified environment
 * @param env The environment to get the configuration for
 * @returns The configuration object for the specified environment
 * @throws Error if an invalid environment is specified
 */
function getEnvironmentConfig(env: string): AppConfig {
  switch (env) {
    case 'development':
      return developmentConfig;
    case 'staging':
      return stagingConfig;
    case 'production':
      return productionConfig;
    default:
      throw new Error(`Invalid environment specified: ${env}`);
  }
}

export default {
  developmentConfig,
  stagingConfig,
  productionConfig,
  getEnvironmentConfig,
};

// List of pending human tasks
/**
 * TODO: Human Tasks
 * 1. Review and update environment-specific configurations
 * 2. Ensure all sensitive information is stored in environment variables and not hardcoded
 * 3. Verify that all required configuration settings for each environment are present
 * 4. Document any new configuration settings added to the AppConfig interface
 */
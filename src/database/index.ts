import { Pool } from 'pg';
import mongoose from 'mongoose';
import { createClient } from 'redis';

// Import PostgreSQL models
import { UserModel } from './models/postgresql/user.model';
import { AccountModel } from './models/postgresql/account.model';
import { TransactionModel } from './models/postgresql/transaction.model';
import { BudgetModel } from './models/postgresql/budget.model';
import { GoalModel } from './models/postgresql/goal.model';

// Import MongoDB models
import { UserPreferenceModel } from './models/mongodb/userPreference.model';
import { FinancialInsightModel } from './models/mongodb/financialInsight.model';
import { InvestmentPortfolioModel } from './models/mongodb/investmentPortfolio.model';
import { CreditScoreModel } from './models/mongodb/creditScore.model';

// Import database configurations
import { postgresConnection } from './config/postgresql.config';
import { mongodbConnection } from './config/mongodb.config';
import { redisConnection } from './config/redis.config';

let postgresClient: Pool;
let mongoClient: typeof mongoose;
let redisClient: ReturnType<typeof createClient>;

/**
 * Initializes connections to PostgreSQL, MongoDB, and Redis databases
 * @returns {Promise<void>}
 */
export async function initializeDatabases(): Promise<void> {
  try {
    // Initialize PostgreSQL connection
    postgresClient = await postgresConnection();
    console.log('PostgreSQL connection established');

    // Initialize MongoDB connection
    mongoClient = await mongodbConnection();
    console.log('MongoDB connection established');

    // Initialize Redis connection
    redisClient = await redisConnection();
    console.log('Redis connection established');
  } catch (error) {
    console.error('Error initializing database connections:', error);
    throw error;
  }
}

/**
 * Closes all active database connections
 * @returns {Promise<void>}
 */
export async function closeDatabaseConnections(): Promise<void> {
  try {
    // Close PostgreSQL connection
    if (postgresClient) {
      await postgresClient.end();
      console.log('PostgreSQL connection closed');
    }

    // Close MongoDB connection
    if (mongoClient) {
      await mongoClient.connection.close();
      console.log('MongoDB connection closed');
    }

    // Close Redis connection
    if (redisClient) {
      await redisClient.quit();
      console.log('Redis connection closed');
    }
  } catch (error) {
    console.error('Error closing database connections:', error);
    throw error;
  }
}

// Export database connections
export { postgresClient as postgresConnection };
export { mongoClient as mongodbConnection };
export { redisClient as redisConnection };

// Export PostgreSQL models
export { UserModel };
export { AccountModel };
export { TransactionModel };
export { BudgetModel };
export { GoalModel };

// Export MongoDB models
export { UserPreferenceModel };
export { FinancialInsightModel };
export { InvestmentPortfolioModel };
export { CreditScoreModel };

// TODO: Implement error handling and retry mechanisms for database connections
// TODO: Set up database connection pooling for improved performance
// TODO: Implement database health check functionality
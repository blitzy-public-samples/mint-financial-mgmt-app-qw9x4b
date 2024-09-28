import { Pool } from 'pg';
import mongoose from 'mongoose';

// Environment variables for database connections
const POSTGRES_URI = process.env.POSTGRES_URI;
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Creates and returns a PostgreSQL connection pool
 * @returns {Pool} PostgreSQL connection pool
 */
const createPostgresConnection = (): Pool => {
  if (!POSTGRES_URI) {
    throw new Error('POSTGRES_URI environment variable is not set');
  }

  return new Pool({
    connectionString: POSTGRES_URI,
    // You can add more configuration options here if needed
  });
};

/**
 * Creates and returns a MongoDB connection
 * @returns {Promise<typeof mongoose>} Mongoose connection instance
 */
const createMongoConnection = async (): Promise<typeof mongoose> => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    return mongoose;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

/**
 * Tests both PostgreSQL and MongoDB connections
 * @returns {Promise<void>}
 */
const testDatabaseConnections = async (): Promise<void> => {
  try {
    // Test PostgreSQL connection
    const pgPool = createPostgresConnection();
    const pgClient = await pgPool.connect();
    await pgClient.query('SELECT NOW()');
    pgClient.release();
    console.log('PostgreSQL connection successful');

    // Test MongoDB connection
    await createMongoConnection();
    console.log('MongoDB connection successful');

  } catch (error) {
    console.error('Database connection test failed:', error);
    throw error;
  }
};

// Export the database configuration object
export const databaseConfig = {
  createPostgresConnection,
  createMongoConnection,
  testDatabaseConnections,
};

// List of pending human tasks
/**
 * TODO: Human tasks
 * 1. Set up proper environment variables for POSTGRES_URI and MONGODB_URI in .env file (Critical)
 * 2. Implement proper error handling and connection retries for database connections (Required)
 * 3. Set up connection pooling configurations for optimal performance (Required)
 * 4. Implement a mechanism to close database connections gracefully on application shutdown (Required)
 */
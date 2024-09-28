import { Pool } from 'pg';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import { appConfig } from '../../shared/config/app-config';

// Assuming appConfig structure
interface AppConfig {
  POSTGRESQL_URI: string;
  MONGODB_URI: string;
  REDIS_URL: string;
}

export const databaseConfig = {
  initPostgresConnection: async (): Promise<Pool> => {
    try {
      const pool = new Pool({
        connectionString: (appConfig as AppConfig).POSTGRESQL_URI,
      });

      // Test the connection
      const client = await pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      console.log('PostgreSQL connection established successfully');
      return pool;
    } catch (error) {
      console.error('Error initializing PostgreSQL connection:', error);
      throw error;
    }
  },

  initMongoConnection: async (): Promise<mongoose.Connection> => {
    try {
      await mongoose.connect((appConfig as AppConfig).MONGODB_URI);
      console.log('MongoDB connection established successfully');
      return mongoose.connection;
    } catch (error) {
      console.error('Error initializing MongoDB connection:', error);
      throw error;
    }
  },

  initRedisConnection: async (): Promise<ReturnType<typeof createClient>> => {
    try {
      const client = createClient({
        url: (appConfig as AppConfig).REDIS_URL,
      });

      await client.connect();
      await client.ping();

      console.log('Redis connection established successfully');
      return client;
    } catch (error) {
      console.error('Error initializing Redis connection:', error);
      throw error;
    }
  },
};

// Human tasks:
// TODO: Implement error handling and connection retries for database connections
// TODO: Set up connection pooling configurations for optimal performance
// TODO: Implement a mechanism to gracefully close database connections when the application shuts down
// TODO: Review and update database connection strings and ensure they are securely stored
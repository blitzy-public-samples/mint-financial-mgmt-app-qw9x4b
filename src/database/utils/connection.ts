import { Pool } from 'pg';
import { MongoClient } from 'mongodb';
import Redis from 'ioredis';

// TODO: Import the actual configuration once the config files are created
const postgresqlConfig = {
  user: process.env.POSTGRESQL_USER,
  host: process.env.POSTGRESQL_HOST,
  database: process.env.POSTGRESQL_DATABASE,
  password: process.env.POSTGRESQL_PASSWORD,
  port: parseInt(process.env.POSTGRESQL_PORT || '5432', 10),
};

const mongodbConfig = {
  url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
  dbName: process.env.MONGODB_DATABASE || 'mintReplica',
};

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

export const createPostgresConnection = (): Pool => {
  try {
    const pool = new Pool(postgresqlConfig);
    console.log('PostgreSQL connection pool created successfully');
    return pool;
  } catch (error) {
    console.error('Error creating PostgreSQL connection pool:', error);
    throw error;
  }
};

export const createMongoConnection = async (): Promise<MongoClient> => {
  try {
    const client = new MongoClient(mongodbConfig.url);
    await client.connect();
    console.log('MongoDB connection created successfully');
    return client;
  } catch (error) {
    console.error('Error creating MongoDB connection:', error);
    throw error;
  }
};

export const createRedisConnection = (): Redis => {
  try {
    const client = new Redis(redisConfig);
    console.log('Redis connection created successfully');
    return client;
  } catch (error) {
    console.error('Error creating Redis connection:', error);
    throw error;
  }
};

export const closePostgresConnection = async (pool: Pool): Promise<void> => {
  try {
    await pool.end();
    console.log('PostgreSQL connection pool closed successfully');
  } catch (error) {
    console.error('Error closing PostgreSQL connection pool:', error);
    throw error;
  }
};

export const closeMongoConnection = async (client: MongoClient): Promise<void> => {
  try {
    await client.close();
    console.log('MongoDB connection closed successfully');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

export const closeRedisConnection = async (client: Redis): Promise<void> => {
  try {
    await client.quit();
    console.log('Redis connection closed successfully');
  } catch (error) {
    console.error('Error closing Redis connection:', error);
    throw error;
  }
};

// TODO: Implement the following tasks:
// - Implement error handling for connection failures
// - Add connection pooling for MongoDB if needed
// - Implement connection retry logic
// - Add logging for connection events
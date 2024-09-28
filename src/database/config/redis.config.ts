import { createClient, RedisClientType } from 'redis';

// Redis configuration object
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || '',
  db: parseInt(process.env.REDIS_DB || '0', 10),
  enableTLS: process.env.REDIS_ENABLE_TLS === 'true',
  retryStrategy: (times: number) => {
    // Exponential backoff with a maximum of 3 seconds
    return Math.min(times * 100, 3000);
  }
};

/**
 * Creates and returns a Redis client instance
 * @returns {Promise<RedisClientType>} An instance of the Redis client
 */
export const createRedisClient = async (): Promise<RedisClientType> => {
  const client = createClient({
    url: `redis://${redisConfig.host}:${redisConfig.port}`,
    password: redisConfig.password,
    database: redisConfig.db,
    socket: {
      tls: redisConfig.enableTLS,
      rejectUnauthorized: false // Consider setting this to true in production with proper SSL setup
    },
    retryStrategy: redisConfig.retryStrategy
  });

  try {
    await client.connect();
    console.log('Successfully connected to Redis');
    return client;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
};

// Human tasks (commented as requested)
/*
TODO: Human tasks
- Verify Redis connection string and credentials (Required)
- Implement error handling for Redis connection failures (Required)
- Set up Redis SSL/TLS configuration if required (Optional)
*/
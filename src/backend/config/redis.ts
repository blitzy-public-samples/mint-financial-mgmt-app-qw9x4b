import Redis from 'ioredis';

// Define the RedisConfig interface
interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  tls?: boolean;
}

// Redis configuration settings
export const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  tls: process.env.REDIS_TLS === 'true',
};

/**
 * Creates and returns a new Redis client instance
 * @returns {Redis} A new Redis client instance
 */
export const createRedisClient = (): Redis => {
  const client = new Redis(redisConfig);

  // Error handling
  client.on('error', (error) => {
    console.error('Redis connection error:', error);
  });

  // Reconnection logic
  client.on('close', () => {
    console.warn('Redis connection closed. Attempting to reconnect...');
    setTimeout(() => {
      client.connect();
    }, 5000); // Retry connection after 5 seconds
  });

  return client;
};

// Human tasks (commented)
/*
TODO:
1. Review and adjust Redis configuration settings for each environment (development, staging, production)
2. Ensure all necessary Redis-related environment variables are documented and included in .env.example
3. Implement error handling and reconnection logic for Redis client
*/
import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { createRedisClient, redisConfig } from '../../config/redis.config';
import { Redis } from 'redis';

describe('Redis Connection', () => {
  let mockRedisClient: jest.Mocked<Redis>;

  beforeAll(() => {
    // Create a mock Redis client
    mockRedisClient = {
      connect: jest.fn(),
      disconnect: jest.fn(),
    } as unknown as jest.Mocked<Redis>;

    // Spy on the Redis.createClient method
    jest.spyOn(Redis, 'createClient').mockReturnValue(mockRedisClient);
  });

  afterAll(() => {
    // Restore the original Redis.createClient method
    jest.restoreAllMocks();
    // Close the mock Redis client if it exists
    if (mockRedisClient) {
      mockRedisClient.disconnect();
    }
  });

  test('should create a Redis client successfully', () => {
    const client = createRedisClient();
    expect(Redis.createClient).toHaveBeenCalledWith(redisConfig);
    expect(client).toBeDefined();
  });

  test('should connect to Redis server', async () => {
    const client = createRedisClient();
    await client.connect();
    expect(mockRedisClient.connect).toHaveBeenCalled();
  });

  test('should disconnect from Redis server', async () => {
    const client = createRedisClient();
    await client.disconnect();
    expect(mockRedisClient.disconnect).toHaveBeenCalled();
  });

  test('should handle connection errors', () => {
    // Mock Redis.createClient to throw an error
    jest.spyOn(Redis, 'createClient').mockImplementation(() => {
      throw new Error('Connection failed');
    });

    expect(() => createRedisClient()).toThrow('Failed to connect to Redis');
  });
});

// Human tasks:
// - Implement integration tests with a real Redis instance
// - Add more specific test cases for different Redis operations
// - Implement test cases for Redis SSL/TLS connections
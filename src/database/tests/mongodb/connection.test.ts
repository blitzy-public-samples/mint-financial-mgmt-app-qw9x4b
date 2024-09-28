import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createConnection } from '../../config/mongodb.config';

describe('MongoDB Connection', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    process.env.MONGODB_DB_NAME = 'testdb';
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should successfully connect to MongoDB', async () => {
    const connection = await createConnection();
    expect(connection).toBeDefined();
    expect(connection.readyState).toBe(1); // 1 means connected
  });

  it('should handle connection errors', async () => {
    const originalUri = process.env.MONGODB_URI;
    process.env.MONGODB_URI = 'mongodb://invalidhost:27017';

    await expect(createConnection()).rejects.toThrow();

    process.env.MONGODB_URI = originalUri;
  });

  it('should use the correct MongoDB URI and database name', async () => {
    const connection = await createConnection();
    expect(connection.host).toBe(new URL(process.env.MONGODB_URI as string).host);
    expect(connection.name).toBe(process.env.MONGODB_DB_NAME);
  });

  it('should use the correct connection options', async () => {
    const connection = await createConnection();
    expect(connection.config.useNewUrlParser).toBe(true);
    expect(connection.config.useUnifiedTopology).toBe(true);
  });
});

// Human tasks:
// TODO: Implement integration tests with a real MongoDB instance or a mock MongoDB server
// TODO: Set up a CI/CD pipeline to run these tests automatically
// TODO: Create more comprehensive tests for edge cases and error scenarios
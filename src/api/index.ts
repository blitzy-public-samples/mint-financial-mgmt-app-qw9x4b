import express from 'express';
import config from 'config';
import { app } from './config/express';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import routes from './routes';

const PORT: number = config.get('port');

async function startServer(): Promise<void> {
  try {
    // Connect to PostgreSQL database
    await connectDatabase();
    console.log('Connected to PostgreSQL database');

    // Connect to MongoDB
    // Note: MongoDB connection is not explicitly mentioned in the specification,
    // but it's a common practice to have multiple databases in a financial application
    // TODO: Implement MongoDB connection

    // Connect to Redis
    await connectRedis();
    console.log('Connected to Redis');

    // Apply routes to the Express app
    app.use('/api', routes);

    // Start listening on the specified port
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
}

startServer();

// Commented list of human tasks
/**
 * Human Tasks:
 * 1. Set up environment-specific configuration files (Required)
 * 2. Implement error handling for database connection failures (Required)
 * 3. Set up logging configuration (Required)
 */

export { app };
// Import configurations from other modules
import expressConfig from './express';
import databaseConfig from './database';
import redisConfig from './redis';
import swaggerConfig from './swagger';

// Define the structure of the config object
interface Config {
  express: any; // Replace 'any' with the actual type once express.ts is implemented
  database: any; // Replace 'any' with the actual type once database.ts is implemented
  redis: any; // Replace 'any' with the actual type once redis.ts is implemented
  swagger: any; // Replace 'any' with the actual type once swagger.ts is implemented
}

// Create and export the config object
const config: Config = {
  express: expressConfig,
  database: databaseConfig,
  redis: redisConfig,
  swagger: swaggerConfig,
};

export default config;

// TODO: Implement the following configuration files:
// - express.ts
// - database.ts
// - redis.ts
// - swagger.ts
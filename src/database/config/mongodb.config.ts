import mongoose from 'mongoose';

// Check if required environment variables are set
if (!process.env.MONGODB_URI || !process.env.MONGODB_DB_NAME) {
  throw new Error('MONGODB_URI and MONGODB_DB_NAME must be set in environment variables');
}

// MongoDB configuration object
export const mongodbConfig = {
  uri: process.env.MONGODB_URI,
  dbName: process.env.MONGODB_DB_NAME,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
  createConnection: createMongodbConnection
};

/**
 * Creates and returns a MongoDB connection using Mongoose
 * @returns {Promise<mongoose.Connection>} A promise that resolves to a Mongoose connection object
 */
async function createMongodbConnection(): Promise<mongoose.Connection> {
  try {
    // Establish connection to MongoDB using Mongoose
    const connection = await mongoose.createConnection(mongodbConfig.uri, {
      ...mongodbConfig.options,
      dbName: mongodbConfig.dbName
    });

    // Set up connection event listeners
    connection.on('connected', () => {
      console.log('Connected to MongoDB');
    });

    connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    connection.on('disconnected', () => {
      console.log('Disconnected from MongoDB');
    });

    // Return the Mongoose connection object
    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Export the mongodbConfig object as default
export default mongodbConfig;

// Human tasks (commented)
/*
TODO: Set up proper environment variables for MongoDB connection in production (Critical)
TODO: Implement connection pooling for MongoDB if needed (Required)
TODO: Set up MongoDB Atlas or other cloud MongoDB service for production use (Required)
*/
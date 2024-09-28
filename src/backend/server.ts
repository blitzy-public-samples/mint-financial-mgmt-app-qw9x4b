import http from 'http';
import https from 'https';
import fs from 'fs';
import { app } from './app';
import { config } from './config';

/**
 * Initializes and starts the HTTP/HTTPS server based on the configuration
 * @returns {Promise<void>} Resolves when the server has started successfully
 */
async function startServer(): Promise<void> {
  try {
    let server;

    if (config.useHttps) {
      // Load SSL/TLS certificates if HTTPS is enabled
      const privateKey = fs.readFileSync(config.sslKeyPath, 'utf8');
      const certificate = fs.readFileSync(config.sslCertPath, 'utf8');
      const credentials = { key: privateKey, cert: certificate };

      // Create HTTPS server
      server = https.createServer(credentials, app);
    } else {
      // Create HTTP server
      server = http.createServer(app);
    }

    // Set up error handling for the server
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof config.port === 'string' ? 'Pipe ' + config.port : 'Port ' + config.port;

      // Handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Start listening on the configured port
    server.listen(config.port, () => {
      const protocol = config.useHttps ? 'HTTPS' : 'HTTP';
      console.log(`${protocol} server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Handles graceful shutdown of the server and associated services
 * @param {string} signal - The signal received to initiate shutdown
 * @returns {Promise<void>} Resolves when the server has shut down gracefully
 */
async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`${signal} signal received: closing HTTP server`);
  
  try {
    // Close the HTTP/HTTPS server
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log('HTTP server closed');
    }

    // Close database connections
    // TODO: Implement database connection closing logic

    // Perform any other necessary cleanup
    // TODO: Add any additional cleanup tasks

    console.log('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Listen for shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Export the server for testing purposes
export { startServer, gracefulShutdown };

// Human tasks (commented)
/**
 * TODO: Human Tasks
 * 1. Generate and securely store SSL/TLS certificates for HTTPS
 * 2. Set up environment-specific configuration for different deployment environments
 */
import winston from 'winston';

// TODO: Import necessary configurations when available
// import { config } from '../config';

/**
 * Creates and configures a Winston logger instance
 * @returns {winston.Logger} Configured Winston logger instance
 */
const createLogger = (): winston.Logger => {
  const logger = winston.createLogger({
    level: 'info', // TODO: Make this configurable via config
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { service: 'mint-replica-api' },
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  });

  // Add file transport for production environment
  if (process.env.NODE_ENV === 'production') {
    logger.add(
      new winston.transports.File({ filename: 'error.log', level: 'error' })
    );
    logger.add(new winston.transports.File({ filename: 'combined.log' }));
  }

  return logger;
};

const logger = createLogger();

/**
 * Wrapper function for logging messages with different severity levels
 * @param {string} level - The log level (e.g., 'info', 'error', 'warn', 'debug')
 * @param {string} message - The log message
 * @param {object} meta - Additional metadata to include in the log entry
 */
export const log = (level: string, message: string, meta: object = {}): void => {
  logger.log(level, message, meta);
};

export { logger };

// TODO: Implement log rotation for production file logging
// TODO: Set up centralized log management system integration (e.g., ELK stack)
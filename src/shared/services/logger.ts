import winston from 'winston';

/**
 * LoggerService: A service class for logging messages with different severity levels
 */
export class LoggerService {
  private logger: winston.Logger;

  /**
   * Initializes the Winston logger with custom configurations
   */
  constructor() {
    // Create a Winston logger instance with custom configurations
    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ''
          }`;
        })
      ),
      transports: [
        // Configure console transport for development environment
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });

    // Configure file transport for production environment
    if (process.env.NODE_ENV === 'production') {
      this.logger.add(
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
      );
      this.logger.add(
        new winston.transports.File({ filename: 'logs/combined.log' })
      );
    }
  }

  /**
   * Logs a message with a specified log level
   * @param level - The log level
   * @param message - The message to log
   * @param meta - Additional metadata to include in the log
   */
  public log(level: string, message: string, meta: object = {}): void {
    // Call the appropriate logging method on the Winston logger instance
    this.logger.log(level, message, meta);
  }

  /**
   * Logs an info level message
   * @param message - The message to log
   * @param meta - Additional metadata to include in the log
   */
  public info(message: string, meta: object = {}): void {
    // Call the log method with 'info' level, message, and meta object
    this.log('info', message, meta);
  }

  /**
   * Logs a warning level message
   * @param message - The message to log
   * @param meta - Additional metadata to include in the log
   */
  public warn(message: string, meta: object = {}): void {
    // Call the log method with 'warn' level, message, and meta object
    this.log('warn', message, meta);
  }

  /**
   * Logs an error level message
   * @param message - The message to log
   * @param meta - Additional metadata to include in the log
   */
  public error(message: string, meta: object = {}): void {
    // Call the log method with 'error' level, message, and meta object
    this.log('error', message, meta);
  }

  /**
   * Logs a debug level message
   * @param message - The message to log
   * @param meta - Additional metadata to include in the log
   */
  public debug(message: string, meta: object = {}): void {
    // Call the log method with 'debug' level, message, and meta object
    this.log('debug', message, meta);
  }
}

// Export a singleton instance of the LoggerService
export const logger = new LoggerService();

// Human tasks:
// TODO: Configure log file rotation and retention policies for production environment
// TODO: Implement log aggregation and centralized logging solution for production
// TODO: Set up alerts for critical log events
import winston from 'winston';

const NODE_ENV = process.env.NODE_ENV || 'development';

const createLogger = (): winston.Logger => {
  // Define log format
  const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  );

  // Create and configure transports based on the environment
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ];

  // Add file transport for non-development environments
  if (NODE_ENV !== 'development') {
    transports.push(
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    );
  }

  // Create and return the logger instance
  return winston.createLogger({
    level: NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'mint-replica-backend' },
    transports,
  });
};

const logger = createLogger();

export { logger };

// Human tasks:
// TODO: Review and adjust log levels for different environments
// TODO: Implement log rotation for production environment
// TODO: Set up centralized log management system integration
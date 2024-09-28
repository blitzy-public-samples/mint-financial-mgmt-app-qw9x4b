import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

// Import internal dependencies
// Note: These imports might need to be adjusted based on the actual file structure
import { config } from './config';
import { middleware } from './middleware';
import { routes } from './routes';

const app: Application = express();

const configureMiddleware = (app: Application): void => {
  // Apply CORS middleware
  app.use(cors()); // TODO: Set up environment-specific CORS configuration

  // Apply Helmet for security headers
  app.use(helmet());

  // Apply compression middleware
  app.use(compression());

  // Apply JSON body parser
  app.use(express.json());

  // Apply URL-encoded body parser
  app.use(express.urlencoded({ extended: true }));

  // Apply Morgan for request logging
  app.use(morgan('combined'));

  // Apply custom error handling middleware
  app.use(middleware.errorHandler);

  // TODO: Implement rate limiting middleware for API endpoints
};

const configureRoutes = (app: Application): void => {
  // Apply authentication routes
  app.use('/api/auth', routes.authRoutes);

  // Apply user routes
  app.use('/api/users', routes.userRoutes);

  // Apply account routes
  app.use('/api/accounts', routes.accountRoutes);

  // Apply transaction routes
  app.use('/api/transactions', routes.transactionRoutes);

  // Apply budget routes
  app.use('/api/budgets', routes.budgetRoutes);

  // Apply goal routes
  app.use('/api/goals', routes.goalRoutes);

  // Apply investment routes
  app.use('/api/investments', routes.investmentRoutes);

  // Apply credit score routes
  app.use('/api/credit-score', routes.creditScoreRoutes);

  // Apply insight routes
  app.use('/api/insights', routes.insightRoutes);

  // Apply catch-all route for handling 404 errors
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });
};

// Configure middleware
configureMiddleware(app);

// Configure routes
configureRoutes(app);

// TODO: Set up API documentation using Swagger or similar tool

export default app;

// List of human tasks
/*
Human tasks:
1. Set up environment-specific CORS configuration
2. Implement rate limiting middleware for API endpoints
3. Set up API documentation using Swagger or similar tool
*/
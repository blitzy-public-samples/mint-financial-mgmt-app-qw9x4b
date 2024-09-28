import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CreditScoreService } from '../services/credit-score.service';
import { authMiddleware } from '../middleware/auth';
import { validateSchema } from '../middleware/validation';
import { CreditScore, CreditScoreHistory, CreditScoreFactors } from '../../shared/types/creditScore';

class CreditScoreController {
  private creditScoreService: CreditScoreService;

  constructor(creditScoreService: CreditScoreService) {
    this.creditScoreService = creditScoreService;
  }

  public getCreditScore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract user ID from the authenticated request
      const userId = (req as any).user.id;

      // Call CreditScoreService to fetch the user's current credit score
      const creditScore: CreditScore = await this.creditScoreService.getCreditScore(userId);

      // If successful, send a 200 OK response with the credit score data
      res.status(StatusCodes.OK).json(creditScore);
    } catch (error) {
      // If an error occurs, pass it to the error handling middleware
      next(error);
    }
  };

  public getCreditScoreHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract user ID from the authenticated request
      const userId = (req as any).user.id;

      // Call CreditScoreService to fetch the user's credit score history
      const creditScoreHistory: CreditScoreHistory = await this.creditScoreService.getCreditScoreHistory(userId);

      // If successful, send a 200 OK response with the credit score history data
      res.status(StatusCodes.OK).json(creditScoreHistory);
    } catch (error) {
      // If an error occurs, pass it to the error handling middleware
      next(error);
    }
  };

  public getCreditScoreFactors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract user ID from the authenticated request
      const userId = (req as any).user.id;

      // Call CreditScoreService to fetch the factors affecting the user's credit score
      const creditScoreFactors: CreditScoreFactors = await this.creditScoreService.getCreditScoreFactors(userId);

      // If successful, send a 200 OK response with the credit score factors data
      res.status(StatusCodes.OK).json(creditScoreFactors);
    } catch (error) {
      // If an error occurs, pass it to the error handling middleware
      next(error);
    }
  };

  public refreshCreditScore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract user ID from the authenticated request
      const userId = (req as any).user.id;

      // Call CreditScoreService to initiate a credit score refresh
      await this.creditScoreService.refreshCreditScore(userId);

      // If successful, send a 202 Accepted response with a message indicating the refresh has been initiated
      res.status(StatusCodes.ACCEPTED).json({ message: 'Credit score refresh has been initiated' });
    } catch (error) {
      // If an error occurs, pass it to the error handling middleware
      next(error);
    }
  };
}

export default CreditScoreController;

// TODO: Implement error handling middleware to catch and format errors consistently across all controller functions
// TODO: Add input validation schemas for any request parameters or body data
// TODO: Implement rate limiting for the refreshCreditScore function to prevent abuse
// TODO: Add logging for important events and error scenarios
// TODO: Create unit tests for all controller functions
// TODO: Implement caching strategy for credit score data to improve performance and reduce load on external credit bureau services
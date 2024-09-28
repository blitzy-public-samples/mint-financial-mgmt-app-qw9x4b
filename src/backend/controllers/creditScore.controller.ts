import { Request, Response } from 'express';
import { CreditScoreService } from '../services/creditScore.service';
import { CreditScore } from '../models/creditScore.model';
import { ResponseInterface } from '../interfaces/response.interface';

class CreditScoreController {
  private creditScoreService: CreditScoreService;

  constructor() {
    this.creditScoreService = new CreditScoreService();
  }

  public getCreditScore = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id; // Assuming the user ID is attached to the request by authentication middleware
      const creditScore: CreditScore = await this.creditScoreService.getLatestCreditScore(userId);
      
      const response: ResponseInterface = {
        success: true,
        data: creditScore,
        message: 'Credit score retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ResponseInterface = {
        success: false,
        message: 'Failed to retrieve credit score',
        error: error.message
      };

      res.status(500).json(response);
    }
  };

  public getCreditScoreHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const creditScoreHistory: CreditScore[] = await this.creditScoreService.getCreditScoreHistory(userId);
      
      const response: ResponseInterface = {
        success: true,
        data: creditScoreHistory,
        message: 'Credit score history retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ResponseInterface = {
        success: false,
        message: 'Failed to retrieve credit score history',
        error: error.message
      };

      res.status(500).json(response);
    }
  };

  public updateCreditScore = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const creditScoreData: Partial<CreditScore> = req.body;

      // Validate the incoming credit score data
      if (!creditScoreData.score || typeof creditScoreData.score !== 'number') {
        throw new Error('Invalid credit score data');
      }

      const updatedCreditScore: CreditScore = await this.creditScoreService.updateCreditScore(userId, creditScoreData);
      
      const response: ResponseInterface = {
        success: true,
        data: updatedCreditScore,
        message: 'Credit score updated successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ResponseInterface = {
        success: false,
        message: 'Failed to update credit score',
        error: error.message
      };

      res.status(400).json(response);
    }
  };

  public getCreditScoreFactors = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const creditScoreFactors = await this.creditScoreService.getCreditScoreFactors(userId);
      
      const response: ResponseInterface = {
        success: true,
        data: creditScoreFactors,
        message: 'Credit score factors retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ResponseInterface = {
        success: false,
        message: 'Failed to retrieve credit score factors',
        error: error.message
      };

      res.status(500).json(response);
    }
  };

  public getCreditScoreRecommendations = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const recommendations = await this.creditScoreService.getCreditScoreRecommendations(userId);
      
      const response: ResponseInterface = {
        success: true,
        data: recommendations,
        message: 'Credit score recommendations retrieved successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ResponseInterface = {
        success: false,
        message: 'Failed to retrieve credit score recommendations',
        error: error.message
      };

      res.status(500).json(response);
    }
  };
}

export default new CreditScoreController();

// Human tasks:
// 1. Implement error handling middleware for consistent error responses
// 2. Add input validation middleware for request parameters and body
// 3. Implement rate limiting for credit score API endpoints
// 4. Set up logging for all credit score-related actions for auditing purposes
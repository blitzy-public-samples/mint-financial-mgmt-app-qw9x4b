import { Request, Response } from 'express';
import { InvestmentService } from '../services/investment.service';
import { Investment } from '../types';

class InvestmentController {
  private investmentService: InvestmentService;

  constructor(investmentService: InvestmentService) {
    this.investmentService = investmentService;
  }

  /**
   * Retrieves all investments for the authenticated user
   */
  public getInvestments = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id; // Assuming the user ID is attached to the request by authentication middleware
      const investments = await this.investmentService.getInvestments(userId);
      res.status(200).json(investments);
    } catch (error) {
      console.error('Error in getInvestments:', error);
      res.status(500).json({ message: 'An error occurred while fetching investments' });
    }
  };

  /**
   * Retrieves a specific investment by its ID for the authenticated user
   */
  public getInvestmentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const investmentId = req.params.id;
      const investment = await this.investmentService.getInvestmentById(userId, investmentId);
      
      if (investment) {
        res.status(200).json(investment);
      } else {
        res.status(404).json({ message: 'Investment not found' });
      }
    } catch (error) {
      console.error('Error in getInvestmentById:', error);
      res.status(500).json({ message: 'An error occurred while fetching the investment' });
    }
  };

  /**
   * Creates a new investment for the authenticated user
   */
  public createInvestment = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const investmentData: Investment = req.body;
      
      // TODO: Implement input validation

      const newInvestment = await this.investmentService.createInvestment(userId, investmentData);
      res.status(201).json(newInvestment);
    } catch (error) {
      console.error('Error in createInvestment:', error);
      res.status(500).json({ message: 'An error occurred while creating the investment' });
    }
  };

  /**
   * Updates an existing investment for the authenticated user
   */
  public updateInvestment = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const investmentId = req.params.id;
      const investmentData: Partial<Investment> = req.body;
      
      // TODO: Implement input validation

      const updatedInvestment = await this.investmentService.updateInvestment(userId, investmentId, investmentData);
      
      if (updatedInvestment) {
        res.status(200).json(updatedInvestment);
      } else {
        res.status(404).json({ message: 'Investment not found' });
      }
    } catch (error) {
      console.error('Error in updateInvestment:', error);
      res.status(500).json({ message: 'An error occurred while updating the investment' });
    }
  };

  /**
   * Deletes an investment for the authenticated user
   */
  public deleteInvestment = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const investmentId = req.params.id;
      
      const deleted = await this.investmentService.deleteInvestment(userId, investmentId);
      
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Investment not found' });
      }
    } catch (error) {
      console.error('Error in deleteInvestment:', error);
      res.status(500).json({ message: 'An error occurred while deleting the investment' });
    }
  };

  /**
   * Retrieves performance data for a specific investment or all investments
   */
  public getInvestmentPerformance = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const investmentId = req.params.id; // Optional: specific investment ID
      const { startDate, endDate } = req.query; // Optional: date range
      
      const performanceData = await this.investmentService.getInvestmentPerformance(
        userId,
        investmentId,
        startDate as string,
        endDate as string
      );
      
      res.status(200).json(performanceData);
    } catch (error) {
      console.error('Error in getInvestmentPerformance:', error);
      res.status(500).json({ message: 'An error occurred while fetching investment performance data' });
    }
  };
}

export default InvestmentController;

// TODO: Implement error handling middleware for consistent error responses across the application
// TODO: Implement input validation middleware or use a validation library like Joi or class-validator
// TODO: Implement authentication middleware to ensure user is authenticated before accessing investment routes
// TODO: Implement rate limiting to prevent abuse of the API
// TODO: Implement logging for all investment-related actions for auditing purposes
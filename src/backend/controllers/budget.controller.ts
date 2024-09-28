import { Request, Response } from 'express';
import { BudgetService } from '../services/budget.service';
import { Budget } from '../models/budget.model';

export class BudgetController {
  private budgetService: BudgetService;

  constructor(budgetService: BudgetService) {
    this.budgetService = budgetService;
  }

  /**
   * Creates a new budget
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public async createBudget(req: Request, res: Response): Promise<void> {
    try {
      const budgetData: Budget = req.body;
      // TODO: Implement input validation
      const createdBudget = await this.budgetService.createBudget(budgetData);
      res.status(201).json(createdBudget);
    } catch (error) {
      // TODO: Implement proper error handling
      res.status(500).json({ message: 'Error creating budget' });
    }
  }

  /**
   * Retrieves all budgets for the authenticated user
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public async getBudgets(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id; // Assuming user is attached to request after authentication
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const budgets = await this.budgetService.getBudgets(userId);
      res.status(200).json(budgets);
    } catch (error) {
      // TODO: Implement proper error handling
      res.status(500).json({ message: 'Error retrieving budgets' });
    }
  }

  /**
   * Retrieves a specific budget by its ID
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public async getBudgetById(req: Request, res: Response): Promise<void> {
    try {
      const budgetId = req.params.id;
      const budget = await this.budgetService.getBudgetById(budgetId);
      if (budget) {
        res.status(200).json(budget);
      } else {
        res.status(404).json({ message: 'Budget not found' });
      }
    } catch (error) {
      // TODO: Implement proper error handling
      res.status(500).json({ message: 'Error retrieving budget' });
    }
  }

  /**
   * Updates an existing budget
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public async updateBudget(req: Request, res: Response): Promise<void> {
    try {
      const budgetId = req.params.id;
      const budgetData: Partial<Budget> = req.body;
      // TODO: Implement input validation
      const updatedBudget = await this.budgetService.updateBudget(budgetId, budgetData);
      if (updatedBudget) {
        res.status(200).json(updatedBudget);
      } else {
        res.status(404).json({ message: 'Budget not found' });
      }
    } catch (error) {
      // TODO: Implement proper error handling
      res.status(500).json({ message: 'Error updating budget' });
    }
  }

  /**
   * Deletes a budget
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public async deleteBudget(req: Request, res: Response): Promise<void> {
    try {
      const budgetId = req.params.id;
      const deleted = await this.budgetService.deleteBudget(budgetId);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Budget not found' });
      }
    } catch (error) {
      // TODO: Implement proper error handling
      res.status(500).json({ message: 'Error deleting budget' });
    }
  }

  /**
   * Retrieves the progress of a specific budget
   * @param req - Express Request object
   * @param res - Express Response object
   */
  public async getBudgetProgress(req: Request, res: Response): Promise<void> {
    try {
      const budgetId = req.params.id;
      const progress = await this.budgetService.getBudgetProgress(budgetId);
      if (progress) {
        res.status(200).json(progress);
      } else {
        res.status(404).json({ message: 'Budget not found' });
      }
    } catch (error) {
      // TODO: Implement proper error handling
      res.status(500).json({ message: 'Error retrieving budget progress' });
    }
  }
}

// TODO: Implement error handling middleware to catch and process any errors thrown in the controller methods
// TODO: Add input validation using a library like Joi or express-validator
// TODO: Implement proper authentication and authorization checks
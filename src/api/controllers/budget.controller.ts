import { Request, Response } from 'express';
import { BudgetService } from '../services/budget.service';
import { authMiddleware } from '../middleware/auth';

class BudgetController {
  private budgetService: BudgetService;

  constructor(budgetService: BudgetService) {
    this.budgetService = budgetService;
  }

  /**
   * Creates a new budget for the authenticated user
   * @param req Express Request object
   * @param res Express Response object
   */
  public createBudget = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract budget data from request body
      const budgetData = req.body;

      // Validate budget data
      // TODO: Implement input validation for budget creation

      // Call BudgetService to create the budget
      const createdBudget = await this.budgetService.createBudget(budgetData);

      // Return the created budget with 201 status code
      res.status(201).json(createdBudget);
    } catch (error) {
      // TODO: Implement error handling
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Retrieves all budgets for the authenticated user
   * @param req Express Request object
   * @param res Express Response object
   */
  public getBudgets = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract query parameters for filtering and pagination
      const { page, limit, ...filters } = req.query;

      // Call BudgetService to get budgets
      const budgets = await this.budgetService.getBudgets(filters, Number(page), Number(limit));

      // Return the budgets with 200 status code
      res.status(200).json(budgets);
    } catch (error) {
      // TODO: Implement error handling
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Retrieves a specific budget by ID for the authenticated user
   * @param req Express Request object
   * @param res Express Response object
   */
  public getBudgetById = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract budget ID from request parameters
      const budgetId = req.params.id;

      // Call BudgetService to get the budget by ID
      const budget = await this.budgetService.getBudgetById(budgetId);

      // If budget not found, return 404 error
      if (!budget) {
        res.status(404).json({ error: 'Budget not found' });
        return;
      }

      // Return the budget with 200 status code
      res.status(200).json(budget);
    } catch (error) {
      // TODO: Implement error handling
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Updates a specific budget for the authenticated user
   * @param req Express Request object
   * @param res Express Response object
   */
  public updateBudget = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract budget ID from request parameters
      const budgetId = req.params.id;

      // Extract updated budget data from request body
      const updatedBudgetData = req.body;

      // Validate updated budget data
      // TODO: Implement input validation for budget update

      // Call BudgetService to update the budget
      const updatedBudget = await this.budgetService.updateBudget(budgetId, updatedBudgetData);

      // If budget not found, return 404 error
      if (!updatedBudget) {
        res.status(404).json({ error: 'Budget not found' });
        return;
      }

      // Return the updated budget with 200 status code
      res.status(200).json(updatedBudget);
    } catch (error) {
      // TODO: Implement error handling
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Deletes a specific budget for the authenticated user
   * @param req Express Request object
   * @param res Express Response object
   */
  public deleteBudget = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract budget ID from request parameters
      const budgetId = req.params.id;

      // Call BudgetService to delete the budget
      const deleted = await this.budgetService.deleteBudget(budgetId);

      // If budget not found, return 404 error
      if (!deleted) {
        res.status(404).json({ error: 'Budget not found' });
        return;
      }

      // Return 204 status code on successful deletion
      res.status(204).send();
    } catch (error) {
      // TODO: Implement error handling
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export default BudgetController;

// List of human tasks:
// TODO: Implement the BudgetService with methods for CRUD operations on budgets
// TODO: Implement input validation for budget creation and update operations
// TODO: Add error handling for various scenarios (e.g., database errors, validation errors)
// TODO: Implement pagination for the getBudgets function
// TODO: Add unit tests for all controller functions
import { Request, Response } from 'express';
import { GoalService } from '../services/goal.service';
import { authMiddleware } from '../middleware/auth';

class GoalController {
  private goalService: GoalService;

  constructor(goalService: GoalService) {
    this.goalService = goalService;
  }

  /**
   * Creates a new financial goal for the authenticated user
   * @param req Express Request object
   * @param res Express Response object
   */
  public createGoal = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract goal data from request body
      const goalData = req.body;

      // Validate goal data (assuming a validateGoalData function exists)
      // if (!validateGoalData(goalData)) {
      //   res.status(400).json({ error: 'Invalid goal data' });
      //   return;
      // }

      // Call GoalService to create the goal
      const createdGoal = await this.goalService.createGoal(req.user.id, goalData);

      // Return the created goal with 201 status code
      res.status(201).json(createdGoal);
    } catch (error) {
      console.error('Error creating goal:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Retrieves all goals for the authenticated user
   * @param req Express Request object
   * @param res Express Response object
   */
  public getGoals = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract user ID from authenticated request
      const userId = req.user.id;

      // Call GoalService to fetch all goals for the user
      const goals = await this.goalService.getGoals(userId);

      // Return the goals with 200 status code
      res.status(200).json(goals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Retrieves a specific goal by ID for the authenticated user
   * @param req Express Request object
   * @param res Express Response object
   */
  public getGoalById = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract goal ID from request parameters
      const goalId = req.params.id;

      // Extract user ID from authenticated request
      const userId = req.user.id;

      // Call GoalService to fetch the goal by ID and user ID
      const goal = await this.goalService.getGoalById(userId, goalId);

      // If goal is not found, return 404 error
      if (!goal) {
        res.status(404).json({ error: 'Goal not found' });
        return;
      }

      // Return the goal with 200 status code
      res.status(200).json(goal);
    } catch (error) {
      console.error('Error fetching goal:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Updates an existing goal for the authenticated user
   * @param req Express Request object
   * @param res Express Response object
   */
  public updateGoal = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract goal ID from request parameters
      const goalId = req.params.id;

      // Extract updated goal data from request body
      const updatedGoalData = req.body;

      // Extract user ID from authenticated request
      const userId = req.user.id;

      // Validate updated goal data (assuming a validateGoalData function exists)
      // if (!validateGoalData(updatedGoalData)) {
      //   res.status(400).json({ error: 'Invalid goal data' });
      //   return;
      // }

      // Call GoalService to update the goal
      const updatedGoal = await this.goalService.updateGoal(userId, goalId, updatedGoalData);

      // If goal is not found, return 404 error
      if (!updatedGoal) {
        res.status(404).json({ error: 'Goal not found' });
        return;
      }

      // Return the updated goal with 200 status code
      res.status(200).json(updatedGoal);
    } catch (error) {
      console.error('Error updating goal:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Deletes a goal for the authenticated user
   * @param req Express Request object
   * @param res Express Response object
   */
  public deleteGoal = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract goal ID from request parameters
      const goalId = req.params.id;

      // Extract user ID from authenticated request
      const userId = req.user.id;

      // Call GoalService to delete the goal
      const deleted = await this.goalService.deleteGoal(userId, goalId);

      // If goal is not found, return 404 error
      if (!deleted) {
        res.status(404).json({ error: 'Goal not found' });
        return;
      }

      // Return 204 status code on successful deletion
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting goal:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export default GoalController;

// Human tasks:
// 1. Implement the GoalService with methods for CRUD operations on goals (Critical)
// 2. Implement input validation for goal creation and update operations (Required)
// 3. Add error handling for various scenarios (e.g., database errors, validation errors) (Required)
// 4. Implement pagination for the getGoals function to handle large numbers of goals (Optional)
// 5. Add unit tests for all controller functions (Required)
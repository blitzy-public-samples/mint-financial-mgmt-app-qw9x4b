import { Request, Response } from 'express';
import { GoalService } from '../services/goal.service';
import { Goal } from '../models/goal.model';

export class GoalController {
  private goalService: GoalService;

  constructor(goalService: GoalService) {
    this.goalService = goalService;
  }

  public async createGoal(req: Request, res: Response): Promise<void> {
    try {
      const goalData: Partial<Goal> = req.body;
      // TODO: Implement validation for goalData
      const createdGoal = await this.goalService.createGoal(goalData);
      res.status(201).json(createdGoal);
    } catch (error) {
      res.status(500).json({ message: 'Error creating goal', error: error.message });
    }
  }

  public async getGoals(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id; // Assuming the user ID is available in the request after authentication
      const goals = await this.goalService.getGoals(userId);
      res.status(200).json(goals);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving goals', error: error.message });
    }
  }

  public async getGoalById(req: Request, res: Response): Promise<void> {
    try {
      const goalId = req.params.id;
      const goal = await this.goalService.getGoalById(goalId);
      if (goal) {
        res.status(200).json(goal);
      } else {
        res.status(404).json({ message: 'Goal not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving goal', error: error.message });
    }
  }

  public async updateGoal(req: Request, res: Response): Promise<void> {
    try {
      const goalId = req.params.id;
      const goalData: Partial<Goal> = req.body;
      // TODO: Implement validation for goalData
      const updatedGoal = await this.goalService.updateGoal(goalId, goalData);
      if (updatedGoal) {
        res.status(200).json(updatedGoal);
      } else {
        res.status(404).json({ message: 'Goal not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating goal', error: error.message });
    }
  }

  public async deleteGoal(req: Request, res: Response): Promise<void> {
    try {
      const goalId = req.params.id;
      const deleted = await this.goalService.deleteGoal(goalId);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Goal not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting goal', error: error.message });
    }
  }

  public async updateGoalProgress(req: Request, res: Response): Promise<void> {
    try {
      const goalId = req.params.id;
      const progressData = req.body;
      // TODO: Implement validation for progressData
      const updatedGoal = await this.goalService.updateGoalProgress(goalId, progressData);
      if (updatedGoal) {
        res.status(200).json(updatedGoal);
      } else {
        res.status(404).json({ message: 'Goal not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating goal progress', error: error.message });
    }
  }
}

// TODO: Implement error handling middleware
// TODO: Add input validation using a library like Joi or class-validator
// TODO: Implement proper authentication and authorization checks
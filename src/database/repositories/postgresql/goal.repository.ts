import { Sequelize, Transaction } from 'sequelize';
import { GoalModel, initGoalModel } from '../../models/postgresql/goal.model';
import { Goal } from '../../../shared/types/goal';

export class GoalRepository {
  private sequelize: Sequelize;
  private goalModel: typeof GoalModel;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
    this.goalModel = initGoalModel(sequelize);
  }

  async create(goalData: Goal, transaction?: Transaction): Promise<Goal> {
    // TODO: Implement input validation
    const createdGoal = await this.goalModel.create(goalData, { transaction });
    return createdGoal.toJSON() as Goal;
  }

  async findById(id: string): Promise<Goal | null> {
    const goal = await this.goalModel.findByPk(id);
    return goal ? goal.toJSON() as Goal : null;
  }

  async findByUserId(userId: string): Promise<Goal[]> {
    const goals = await this.goalModel.findAll({ where: { userId } });
    return goals.map(goal => goal.toJSON() as Goal);
  }

  async update(id: string, goalData: Partial<Goal>, transaction?: Transaction): Promise<Goal | null> {
    const goal = await this.goalModel.findByPk(id);
    if (!goal) {
      return null;
    }
    const updatedGoal = await goal.update(goalData, { transaction });
    return updatedGoal.toJSON() as Goal;
  }

  async delete(id: string, transaction?: Transaction): Promise<boolean> {
    const deletedRowsCount = await this.goalModel.destroy({
      where: { id },
      transaction
    });
    return deletedRowsCount > 0;
  }
}

// TODO: Implement error handling and logging for database operations
// TODO: Add input validation for all repository methods
// TODO: Implement pagination for the findByUserId method if needed
// TODO: Add any additional methods for specific goal-related queries or operations
// TODO: Implement unit tests for the GoalRepository class
import { Model, DataTypes, Sequelize } from 'sequelize';
import { Budget, CreateBudgetDTO, UpdateBudgetDTO, BudgetPeriod, BudgetSummary } from '../types/budget';

class BudgetModel extends Model<Budget, CreateBudgetDTO> implements Budget {
  public id!: string;
  public userId!: string;
  public categoryId!: string;
  public name!: string;
  public amount!: number;
  public period!: BudgetPeriod;
  public startDate!: Date;
  public endDate!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Custom method to convert the model instance to a plain object
  public toJSON(): Budget {
    const values = Object.assign({}, this.get());
    return values as Budget;
  }

  // Custom method to update the budget
  public async update(updateData: UpdateBudgetDTO): Promise<Budget> {
    // Validate the update data
    if (updateData.amount && updateData.amount <= 0) {
      throw new Error('Budget amount must be greater than zero');
    }

    // Apply the updates to the model instance
    await super.update(updateData);

    // Return the updated budget
    return this.toJSON();
  }

  // Custom method to generate a summary of the budget
  public async getSummary(): Promise<BudgetSummary> {
    // TODO: Implement logic to calculate spent amount
    const spentAmount = 0; // Placeholder value

    const remainingAmount = this.amount - spentAmount;

    return {
      id: this.id,
      name: this.name,
      amount: this.amount,
      spentAmount,
      remainingAmount,
      period: this.period,
      startDate: this.startDate,
      endDate: this.endDate,
    };
  }
}

export const initBudgetModel = (sequelize: Sequelize): typeof BudgetModel => {
  BudgetModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      period: {
        type: DataTypes.ENUM(...Object.values(BudgetPeriod)),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'budgets',
      timestamps: true,
    }
  );

  return BudgetModel;
};

export default BudgetModel;

// Human tasks:
// TODO: Implement data validation logic in the update method to ensure data integrity
// TODO: Add more sophisticated budget calculation methods if needed for advanced reporting
// TODO: Set up proper index for userId and categoryId fields for query optimization
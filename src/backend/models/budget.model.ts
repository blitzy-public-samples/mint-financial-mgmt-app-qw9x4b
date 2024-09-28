import { DataTypes, Model, Sequelize } from 'sequelize';
import { Budget } from '../../shared/types/budget';

export class BudgetModel extends Model<Budget> implements Budget {
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

  public static associate(models: any): void {
    // Define belongsTo association with User model
    BudgetModel.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    // Define belongsTo association with Category model
    BudgetModel.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
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
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Budget',
      tableName: 'budgets',
      timestamps: true,
      underscored: true,
    }
  );

  return BudgetModel;
};

// TODO: Import this from a shared enum file when available
type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

```

This implementation includes:

1. The `BudgetModel` class that extends Sequelize's `Model` and implements the `Budget` interface.
2. The `associate` method to define relationships with User and Category models.
3. The `initBudgetModel` function to initialize the Sequelize model with the correct attributes and options.
4. A temporary `BudgetPeriod` type definition, which should be replaced with an import from a shared enum file when it becomes available.

Here are some comments on the pending human tasks:

```typescript
// Human Tasks:
// TODO: Ensure that the database schema for the 'budgets' table matches the model definition
// TODO: Implement and test the association methods with User and Category models
// TODO: Add any necessary indexes to the 'budgets' table for query optimization
// TODO: Consider adding custom validation methods or hooks if needed for budget-specific logic
import { Model, DataTypes, Sequelize } from 'sequelize';
import { Budget, BudgetPeriod } from '../../../shared/types/budget';
import postgresqlConfig from '../../config/postgresql.config';

@Table({ tableName: 'budgets' })
class BudgetModel extends Model<Budget> implements Budget {
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

  public toJSON(): object {
    const values = Object.assign({}, this.get());
    values.startDate = this.startDate.toISOString();
    values.endDate = this.endDate.toISOString();
    values.createdAt = this.createdAt.toISOString();
    values.updatedAt = this.updatedAt.toISOString();
    return values;
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
        references: {
          model: 'users',
          key: 'id',
        },
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Budget',
      tableName: 'budgets',
      timestamps: true,
    }
  );

  BudgetModel.belongsTo(sequelize.models.User, { foreignKey: 'userId', as: 'user' });
  BudgetModel.belongsTo(sequelize.models.Category, { foreignKey: 'categoryId', as: 'category' });

  return BudgetModel;
};

export default BudgetModel;
```

This implementation includes the following features:

1. The `BudgetModel` class extends Sequelize's `Model` class and implements the `Budget` interface.
2. The model includes all the required fields as specified in the JSON representation.
3. A custom `toJSON` method is implemented to format date fields as ISO strings.
4. The `initBudgetModel` function initializes the model with Sequelize, defining the schema and setting up associations with User and Category models.
5. The model uses UUID for the primary key and foreign keys.
6. Proper data types and constraints are set for each field.
7. Timestamps are enabled for `createdAt` and `updatedAt` fields.

Here are the pending human tasks as comments:

```typescript
// TODO: Review and confirm the database schema for the Budget model
// TODO: Implement validation rules for budget amount and date ranges
// TODO: Set up proper indexing for frequently queried fields (e.g., userId, categoryId)
// TODO: (Optional) Implement a method to calculate budget progress and remaining amount
import { Model, DataTypes, Sequelize } from 'sequelize';

@Table({ tableName: 'goals' })
export class GoalModel extends Model {
  public id!: string;
  public userId!: string;
  public name!: string;
  public targetAmount!: number;
  public targetDate!: Date;
  public currentAmount!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export const initGoalModel = (sequelize: Sequelize): typeof GoalModel => {
  GoalModel.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      targetAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      targetDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      currentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
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
      tableName: 'goals',
      timestamps: true,
    }
  );

  return GoalModel;
};
```

This code defines the `GoalModel` class and the `initGoalModel` function as specified in the JSON representation. Here's a breakdown of the implementation:

1. We import the necessary types from Sequelize.
2. The `GoalModel` class extends Sequelize's `Model` class and defines the properties as specified.
3. The `initGoalModel` function initializes the model with Sequelize, defining the schema for the Goal model.
4. We use UUID for the `id` field and set it as the primary key.
5. The `userId` field is a foreign key referencing the `users` table.
6. We use `DECIMAL(10, 2)` for monetary amounts to ensure precision.
7. Timestamps (`createdAt` and `updatedAt`) are automatically managed by Sequelize.

Note that we haven't implemented any associations or hooks in this file, as they weren't specified in the JSON representation. If needed, they should be added in a separate file or as part of the application's database initialization process.

Here are the commented human tasks within the file:

```typescript
// Human tasks:
// TODO: Review and confirm the database schema for the Goal model
// TODO: Verify if any additional fields or indexes are needed for the Goal model
// TODO: Confirm if any specific Sequelize options or validations should be added to the model
// TODO: Determine if there should be any associations between the Goal model and other models (e.g., User or Account)
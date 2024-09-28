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
      underscored: true,
    }
  );

  return GoalModel;
};

// TODO: Implement model associations (e.g., with User model)
// GoalModel.associate = (models) => {
//   GoalModel.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
// };

// TODO: Add any additional methods or validations specific to the Goal model
// For example:
// GoalModel.prototype.calculateProgress = function() {
//   return (this.currentAmount / this.targetAmount) * 100;
// };

/**
 * Human tasks:
 * 1. Verify that the Goal model attributes align with the database schema and application requirements
 * 2. Implement necessary model associations (e.g., with User model)
 * 3. Add any additional methods or validations specific to the Goal model
 */
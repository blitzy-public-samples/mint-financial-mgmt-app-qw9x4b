import { Model, DataTypes, Sequelize } from 'sequelize';

// Interface representing the attributes of the Investment model
interface InvestmentAttributes {
  id: string;
  userId: string;
  name: string;
  type: string;
  currentValue: number;
  initialValue: number;
  purchaseDate: Date;
  returnRate: number;
  provider: string;
  lastUpdated: Date;
}

// Interface representing the Investment instance
interface InvestmentInstance extends Model<InvestmentAttributes>, InvestmentAttributes {}

// Investment model definition
class InvestmentModel extends Model<InvestmentAttributes, InvestmentAttributes> implements InvestmentAttributes {
  public id!: string;
  public userId!: string;
  public name!: string;
  public type!: string;
  public currentValue!: number;
  public initialValue!: number;
  public purchaseDate!: Date;
  public returnRate!: number;
  public provider!: string;
  public lastUpdated!: Date;

  // Define associations
  public static associate(models: any): void {
    // Associate Investment with User model (belongsTo relationship)
    InvestmentModel.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

// Function to initialize the Investment model
export const initInvestmentModel = (sequelize: Sequelize): typeof InvestmentModel => {
  InvestmentModel.init(
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
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currentValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      initialValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      returnRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastUpdated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Investment',
      tableName: 'investments',
      timestamps: true,
    }
  );

  return InvestmentModel;
};

export default InvestmentModel;

// Human tasks:
// TODO: Review and adjust the Investment model attributes to ensure they meet all business requirements
// TODO: Implement any additional methods or validations specific to the Investment model
// TODO: Update the src/backend/models/index.ts file to include the InvestmentModel export
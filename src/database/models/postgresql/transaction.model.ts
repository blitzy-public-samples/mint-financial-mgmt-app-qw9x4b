import { Model, DataTypes, Sequelize } from 'sequelize';
import { Transaction } from '../../../shared/types/transaction';
import { AccountModel } from './account.model';

export class TransactionModel extends Model<Transaction> {
  public id!: string;
  public accountId!: string;
  public categoryId!: string;
  public transactionDate!: Date;
  public amount!: number;
  public description!: string;
  public isPending!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export const initTransactionModel = (sequelize: Sequelize): typeof TransactionModel => {
  TransactionModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'id',
        },
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isPending: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      tableName: 'transactions',
      modelName: 'Transaction',
    }
  );

  // Set up association with AccountModel
  TransactionModel.belongsTo(AccountModel, {
    foreignKey: 'accountId',
    as: 'account',
  });

  return TransactionModel;
};

// Human tasks:
// TODO: Review and confirm the database schema for the Transaction model
// TODO: Verify if any additional fields or indexes are needed for the Transaction model
// TODO: Confirm if any specific Sequelize options or validations should be added to the model
// TODO: Review the association between Transaction and Account models
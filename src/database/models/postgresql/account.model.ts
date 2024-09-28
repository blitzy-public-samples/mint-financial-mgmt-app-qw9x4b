import { Model, DataTypes, Sequelize } from 'sequelize';

// Define AccountType enum
export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT_CARD = 'CREDIT_CARD',
  INVESTMENT = 'INVESTMENT',
  LOAN = 'LOAN',
  OTHER = 'OTHER'
}

// Define Account interface
export interface Account {
  id: string;
  userId: string;
  institutionName: string;
  accountType: AccountType;
  accountName: string;
  balance: number;
  currency: string;
  lastSynced: Date;
  createdAt: Date;
  updatedAt: Date;
}

@Table({ tableName: 'accounts' })
export class AccountModel extends Model<Account> implements Account {
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  userId!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  institutionName!: string;

  @Column({
    type: DataTypes.ENUM(...Object.values(AccountType)),
    allowNull: false,
  })
  accountType!: AccountType;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  accountName!: string;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  })
  balance!: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  currency!: string;

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
  })
  lastSynced!: Date;

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
  })
  createdAt!: Date;

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
  })
  updatedAt!: Date;
}

export const initAccountModel = (sequelize: Sequelize): typeof AccountModel => {
  AccountModel.init(
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
      institutionName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountType: {
        type: DataTypes.ENUM(...Object.values(AccountType)),
        allowNull: false,
      },
      accountName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastSynced: {
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
      modelName: 'Account',
      tableName: 'accounts',
    }
  );

  return AccountModel;
};

// Human tasks:
// TODO: Review and confirm the database schema for the Account model
// TODO: Verify if any additional fields or indexes are needed for the Account model
// TODO: Confirm if any specific Sequelize options or validations should be added to the model
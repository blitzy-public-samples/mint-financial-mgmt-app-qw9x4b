import { Model, DataTypes, Sequelize } from 'sequelize';

// TODO: Import the Account and AccountType from '../../shared/types/account' when available
// import { Account, AccountType } from '../../shared/types/account';

// Temporary type definition until the shared types are available
enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT_CARD = 'CREDIT_CARD',
  INVESTMENT = 'INVESTMENT',
  LOAN = 'LOAN',
  OTHER = 'OTHER'
}

interface Account {
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

class AccountModel extends Model<Account> implements Account {
  public id!: string;
  public userId!: string;
  public institutionName!: string;
  public accountType!: AccountType;
  public accountName!: string;
  public balance!: number;
  public currency!: string;
  public lastSynced!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Custom method to convert the model instance to a plain object
  public toJSON(): Account {
    const values = super.toJSON() as Account;
    return {
      id: values.id,
      userId: values.userId,
      institutionName: values.institutionName,
      accountType: values.accountType,
      accountName: values.accountName,
      balance: values.balance,
      currency: values.currency,
      lastSynced: values.lastSynced,
      createdAt: values.createdAt,
      updatedAt: values.updatedAt,
    };
  }
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
        type: DataTypes.STRING(3),
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
      timestamps: true,
    }
  );

  return AccountModel;
};

export default AccountModel;
```

This implementation includes the following features:

1. A temporary `AccountType` enum and `Account` interface to represent the structure until the shared types are available.
2. The `AccountModel` class extends Sequelize's `Model` and implements the `Account` interface.
3. The `initAccountModel` function initializes the Sequelize model with the correct attributes and options.
4. A custom `toJSON` method to ensure the returned object matches the `Account` interface.
5. Proper typing for all properties and methods.

Here are the pending human tasks as comments within the file:

```typescript
// Pending human tasks:
// 1. Review and validate the AccountModel properties and methods (Required)
// 2. Confirm if any additional methods or associations are needed for the AccountModel (Optional)
// 3. Verify if any additional indexes or constraints are required for the accounts table (Optional)
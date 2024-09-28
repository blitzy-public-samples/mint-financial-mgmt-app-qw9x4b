import { Model, DataTypes, Table } from 'sequelize';
import { Transaction, TransactionCategory, TransactionType } from '../../shared/types/transaction';

@Table({ tableName: 'transactions' })
export class TransactionModel extends Model<Transaction> implements Transaction {
  public id!: string;
  public accountId!: string;
  public date!: Date;
  public amount!: number;
  public description!: string;
  public category!: TransactionCategory;
  public type!: TransactionType;
  public isRecurring!: boolean;
  public isPending!: boolean;
  public merchantName!: string | null;
  public locationCity!: string | null;
  public locationState!: string | null;
  public notes!: string | null;
  public tags!: string[];

  static initialize(sequelize: any) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        accountId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        date: {
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
        category: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isRecurring: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        isPending: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        merchantName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        locationCity: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        locationState: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        tags: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
        },
      },
      {
        sequelize,
        modelName: 'Transaction',
        timestamps: true,
      }
    );
  }
}

export default TransactionModel;
```

This implementation creates a Sequelize model for the Transaction entity based on the provided JSON specification. Here are some key points about the implementation:

1. We import the necessary types from Sequelize and the shared transaction types (which we assume will be created in the future).
2. The `@Table` decorator is used to specify the table name in the database.
3. The `TransactionModel` class extends Sequelize's `Model` class and implements the `Transaction` interface.
4. All the properties specified in the JSON are declared with their respective types.
5. The `initialize` static method is added to set up the model with Sequelize. This method defines the schema for the transaction table.
6. Each field is defined with its appropriate Sequelize DataType, including constraints like `allowNull` and `defaultValue` where applicable.
7. The `tags` field is defined as an array of strings using `DataTypes.ARRAY(DataTypes.STRING)`.
8. Timestamps are enabled for the model, which will automatically add `createdAt` and `updatedAt` fields.

Here are the pending human tasks as comments:

```typescript
// TODO: Ensure that the TransactionModel properties align with the database schema and any additional requirements

// TODO: Implement any necessary model validation or custom methods specific to the Transaction model

// TODO: Set up appropriate indexes on the transactions table for optimal query performance
import { Op } from 'sequelize';
import { TransactionModel, initTransactionModel } from '../../models/postgresql/transaction.model';
import { Transaction } from '../../../shared/types/transaction';

export class TransactionRepository {
  private model: typeof TransactionModel;

  constructor(model: typeof TransactionModel) {
    this.model = model;
  }

  async create(transactionData: Transaction): Promise<Transaction> {
    const createdTransaction = await this.model.create(transactionData);
    return createdTransaction.toJSON() as Transaction;
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.model.findByPk(id);
    return transaction ? transaction.toJSON() as Transaction : null;
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const transactions = await this.model.findAll({
      where: { accountId },
    });
    return transactions.map(transaction => transaction.toJSON() as Transaction);
  }

  async update(id: string, transactionData: Partial<Transaction>): Promise<Transaction | null> {
    const [updatedRowsCount, updatedTransactions] = await this.model.update(transactionData, {
      where: { id },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      return null;
    }

    return updatedTransactions[0].toJSON() as Transaction;
  }

  async delete(id: string): Promise<boolean> {
    const deletedRowsCount = await this.model.destroy({
      where: { id },
    });

    return deletedRowsCount > 0;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    const transactions = await this.model.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    return transactions.map(transaction => transaction.toJSON() as Transaction);
  }
}

export const createTransactionRepository = (): TransactionRepository => {
  // Note: The actual implementation of getting the database connection is pending
  // and should be implemented in src/database/utils/connection.ts
  const dbConnection = {} as any; // Placeholder for the actual database connection

  const TransactionModel = initTransactionModel(dbConnection);
  return new TransactionRepository(TransactionModel);
};

// Human tasks:
// TODO: Implement the database connection utility in src/database/utils/connection.ts
// TODO: Create and implement the repository interface in src/database/interfaces/repository.interface.ts
// TODO: Implement table name constants in src/database/constants/table-names.ts
// TODO: Review and implement any additional transaction-specific query methods that may be needed
// TODO: Implement error handling and logging for database operations
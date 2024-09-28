import { Model, DataTypes, Op } from 'sequelize';

// Define the Transaction type
export interface Transaction {
  id: string;
  accountId: string;
  date: Date;
  amount: number;
  description: string;
  category: TransactionCategory;
  type: TransactionType;
  isRecurring: boolean;
  isPending: boolean;
  merchantName: string | null;
  locationCity: string | null;
  locationState: string | null;
  notes: string | null;
  tags: string[];
}

// Define the TransactionCategory enum
export enum TransactionCategory {
  // Add categories here, e.g.:
  FOOD = 'FOOD',
  TRANSPORTATION = 'TRANSPORTATION',
  HOUSING = 'HOUSING',
  // ... add more categories as needed
}

// Define the TransactionType enum
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

// Define the TransactionFilter type
export interface TransactionFilter {
  accountId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  category?: TransactionCategory;
  type?: TransactionType;
  isRecurring?: boolean;
  isPending?: boolean;
  searchTerm?: string;
}

@Table({ tableName: 'transactions' })
export class TransactionModel extends Model<Transaction> implements Transaction {
  @Column({ primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 })
  id!: string;

  @Column({ type: DataTypes.UUID, allowNull: false })
  accountId!: string;

  @Column({ type: DataTypes.DATE, allowNull: false })
  date!: Date;

  @Column({ type: DataTypes.DECIMAL(10, 2), allowNull: false })
  amount!: number;

  @Column({ type: DataTypes.STRING, allowNull: false })
  description!: string;

  @Column({ type: DataTypes.ENUM(...Object.values(TransactionCategory)), allowNull: false })
  category!: TransactionCategory;

  @Column({ type: DataTypes.ENUM(...Object.values(TransactionType)), allowNull: false })
  type!: TransactionType;

  @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false })
  isRecurring!: boolean;

  @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false })
  isPending!: boolean;

  @Column({ type: DataTypes.STRING, allowNull: true })
  merchantName!: string | null;

  @Column({ type: DataTypes.STRING, allowNull: true })
  locationCity!: string | null;

  @Column({ type: DataTypes.STRING, allowNull: true })
  locationState!: string | null;

  @Column({ type: DataTypes.TEXT, allowNull: true })
  notes!: string | null;

  @Column({ type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] })
  tags!: string[];

  static async createTransaction(transactionData: Transaction): Promise<Transaction> {
    // TODO: Implement data validation logic
    const transaction = await this.create(transactionData);
    return transaction.toJSON();
  }

  static async getTransactionById(id: string): Promise<Transaction | null> {
    const transaction = await this.findByPk(id);
    return transaction ? transaction.toJSON() : null;
  }

  static async updateTransaction(id: string, updateData: Partial<Transaction>): Promise<Transaction> {
    // TODO: Implement data validation logic
    const [, [updatedTransaction]] = await this.update(updateData, {
      where: { id },
      returning: true,
    });
    return updatedTransaction.toJSON();
  }

  static async deleteTransaction(id: string): Promise<boolean> {
    const deletedCount = await this.destroy({ where: { id } });
    return deletedCount > 0;
  }

  static async getTransactions(filter: TransactionFilter, limit: number, offset: number): Promise<{ transactions: Transaction[], total: number }> {
    const whereClause: any = {};

    if (filter.accountId) whereClause.accountId = filter.accountId;
    if (filter.startDate) whereClause.date = { [Op.gte]: filter.startDate };
    if (filter.endDate) whereClause.date = { ...whereClause.date, [Op.lte]: filter.endDate };
    if (filter.minAmount) whereClause.amount = { [Op.gte]: filter.minAmount };
    if (filter.maxAmount) whereClause.amount = { ...whereClause.amount, [Op.lte]: filter.maxAmount };
    if (filter.category) whereClause.category = filter.category;
    if (filter.type) whereClause.type = filter.type;
    if (filter.isRecurring !== undefined) whereClause.isRecurring = filter.isRecurring;
    if (filter.isPending !== undefined) whereClause.isPending = filter.isPending;
    if (filter.searchTerm) {
      whereClause[Op.or] = [
        { description: { [Op.iLike]: `%${filter.searchTerm}%` } },
        { merchantName: { [Op.iLike]: `%${filter.searchTerm}%` } },
      ];
    }

    const { rows, count } = await this.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['date', 'DESC']],
    });

    return {
      transactions: rows.map(row => row.toJSON()),
      total: count,
    };
  }

  static async categorizeTransaction(id: string): Promise<TransactionCategory> {
    // TODO: Implement integration with ML service for transaction categorization
    const transaction = await this.findByPk(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // This is a placeholder. In a real implementation, you would call an ML service here.
    const predictedCategory = TransactionCategory.FOOD; // Example predicted category

    await transaction.update({ category: predictedCategory });
    return predictedCategory;
  }
}

// TODO: Implement data validation logic for transaction creation and updates
// TODO: Integrate with the machine learning service for transaction categorization
// TODO: Set up database indexes for optimal query performance
// TODO: Implement error handling and logging for all database operations
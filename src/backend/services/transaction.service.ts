import { inject, injectable } from 'inversify';
import { Decimal } from 'decimal.js';
import { TransactionRepository } from '../repositories/postgresql/transaction.repository';
import { Transaction } from '../models/transaction.model';
import { AccountService } from './account.service';
import { CategoryService } from './category.service';
import { Logger } from '../utils/logger';
import { ApiError } from '../utils/apiError';

@injectable()
export class TransactionService {
  private transactionRepository: TransactionRepository;
  private accountService: AccountService;
  private categoryService: CategoryService;
  private logger: Logger;

  constructor(
    @inject(TransactionRepository) transactionRepository: TransactionRepository,
    @inject(AccountService) accountService: AccountService,
    @inject(CategoryService) categoryService: CategoryService,
    @inject(Logger) logger: Logger
  ) {
    this.transactionRepository = transactionRepository;
    this.accountService = accountService;
    this.categoryService = categoryService;
    this.logger = logger;
  }

  async createTransaction(transactionData: Transaction): Promise<Transaction> {
    this.logger.info('Creating new transaction', { transactionData });

    // Validate transaction data
    if (!this.validateTransactionData(transactionData)) {
      throw new ApiError(400, 'Invalid transaction data');
    }

    // Check if the account exists
    const accountExists = await this.accountService.checkAccountExists(transactionData.accountId);
    if (!accountExists) {
      throw new ApiError(404, 'Account not found');
    }

    // Categorize the transaction if category is not provided
    if (!transactionData.categoryId) {
      transactionData.categoryId = await this.categorizeTransaction(transactionData);
    }

    // Create the transaction in the database
    const createdTransaction = await this.transactionRepository.create(transactionData);

    // Update the account balance
    await this.accountService.updateBalance(transactionData.accountId, transactionData.amount);

    this.logger.info('Transaction created successfully', { transactionId: createdTransaction.id });
    return createdTransaction;
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    this.logger.info('Fetching transaction by ID', { transactionId });

    if (!this.validateTransactionId(transactionId)) {
      throw new ApiError(400, 'Invalid transaction ID');
    }

    const transaction = await this.transactionRepository.findById(transactionId);

    if (!transaction) {
      throw new ApiError(404, 'Transaction not found');
    }

    return transaction;
  }

  async updateTransaction(transactionId: string, updateData: Partial<Transaction>): Promise<Transaction> {
    this.logger.info('Updating transaction', { transactionId, updateData });

    if (!this.validateTransactionId(transactionId) || !this.validateUpdateData(updateData)) {
      throw new ApiError(400, 'Invalid transaction ID or update data');
    }

    const existingTransaction = await this.transactionRepository.findById(transactionId);
    if (!existingTransaction) {
      throw new ApiError(404, 'Transaction not found');
    }

    const updatedTransaction = await this.transactionRepository.update(transactionId, updateData);

    // Adjust account balance if amount changed
    if (updateData.amount && !updateData.amount.equals(existingTransaction.amount)) {
      const amountDifference = updateData.amount.minus(existingTransaction.amount);
      await this.accountService.updateBalance(existingTransaction.accountId, amountDifference);
    }

    this.logger.info('Transaction updated successfully', { transactionId });
    return updatedTransaction;
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    this.logger.info('Deleting transaction', { transactionId });

    if (!this.validateTransactionId(transactionId)) {
      throw new ApiError(400, 'Invalid transaction ID');
    }

    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      throw new ApiError(404, 'Transaction not found');
    }

    await this.transactionRepository.delete(transactionId);

    // Update account balance
    await this.accountService.updateBalance(transaction.accountId, transaction.amount.negated());

    this.logger.info('Transaction deleted successfully', { transactionId });
  }

  async getTransactionsByAccount(
    accountId: string,
    filters: object,
    pagination: object
  ): Promise<{ transactions: Transaction[]; total: number }> {
    this.logger.info('Fetching transactions by account', { accountId, filters, pagination });

    if (!this.validateAccountId(accountId)) {
      throw new ApiError(400, 'Invalid account ID');
    }

    const result = await this.transactionRepository.findByAccount(accountId, filters, pagination);

    return result;
  }

  private async categorizeTransaction(transaction: Transaction): Promise<string> {
    // This is a placeholder for the actual implementation
    // In a real-world scenario, this would use a machine learning model or a rule-based system
    this.logger.info('Categorizing transaction', { transactionDescription: transaction.description });
    const categoryId = await this.categoryService.suggestCategory(transaction.description);
    return categoryId;
  }

  async generateTransactionInsights(userId: string, startDate: Date, endDate: Date): Promise<object> {
    this.logger.info('Generating transaction insights', { userId, startDate, endDate });

    // Fetch user's transactions within the date range
    const transactions = await this.transactionRepository.findByUserAndDateRange(userId, startDate, endDate);

    // Analyze spending patterns
    const spendingByCategory = this.analyzeSpendingByCategory(transactions);

    // Identify unusual transactions
    const unusualTransactions = this.identifyUnusualTransactions(transactions);

    // Generate savings opportunities
    const savingsOpportunities = this.generateSavingsOpportunities(transactions);

    return {
      spendingByCategory,
      unusualTransactions,
      savingsOpportunities,
    };
  }

  private validateTransactionData(transactionData: Transaction): boolean {
    // Implement validation logic
    return true;
  }

  private validateTransactionId(transactionId: string): boolean {
    // Implement validation logic
    return true;
  }

  private validateUpdateData(updateData: Partial<Transaction>): boolean {
    // Implement validation logic
    return true;
  }

  private validateAccountId(accountId: string): boolean {
    // Implement validation logic
    return true;
  }

  private analyzeSpendingByCategory(transactions: Transaction[]): object {
    // Implement spending analysis logic
    return {};
  }

  private identifyUnusualTransactions(transactions: Transaction[]): Transaction[] {
    // Implement unusual transaction identification logic
    return [];
  }

  private generateSavingsOpportunities(transactions: Transaction[]): object {
    // Implement savings opportunities generation logic
    return {};
  }
}

// Human tasks:
// TODO: Implement machine learning model for transaction categorization
// TODO: Define and implement specific rules for generating transaction insights
// TODO: Integrate with a real-time fraud detection system
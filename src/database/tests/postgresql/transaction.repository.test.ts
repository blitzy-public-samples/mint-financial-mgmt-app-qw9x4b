import { describe, beforeAll, afterAll, beforeEach, afterEach, it, expect } from '@jest/globals';
import { TransactionRepository, createTransactionRepository } from '../../repositories/postgresql/transaction.repository';
import { Transaction } from '../../../shared/types/transaction';
import { setupTestDatabase, teardownTestDatabase } from '../utils/test-utils';

describe('TransactionRepository', () => {
  let transactionRepository: TransactionRepository;
  let testTransaction: Transaction;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    transactionRepository = await createTransactionRepository();
    testTransaction = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      accountId: '123e4567-e89b-12d3-a456-426614174001',
      amount: 100.00,
      date: new Date('2023-05-01'),
      description: 'Test transaction',
      category: 'Food',
      type: 'expense'
    };
  });

  afterEach(async () => {
    // Clean up the test database after each test
    await transactionRepository.deleteAll();
  });

  it('should create a new transaction', async () => {
    const createdTransaction = await transactionRepository.create(testTransaction);
    expect(createdTransaction).toEqual(testTransaction);
  });

  it('should find a transaction by id', async () => {
    await transactionRepository.create(testTransaction);
    const foundTransaction = await transactionRepository.findById(testTransaction.id);
    expect(foundTransaction).toEqual(testTransaction);
  });

  it('should find transactions by account id', async () => {
    await transactionRepository.create(testTransaction);
    const foundTransactions = await transactionRepository.findByAccountId(testTransaction.accountId);
    expect(foundTransactions).toHaveLength(1);
    expect(foundTransactions[0]).toEqual(testTransaction);
  });

  it('should update a transaction', async () => {
    await transactionRepository.create(testTransaction);
    const updatedTransaction = { ...testTransaction, amount: 150.00 };
    const result = await transactionRepository.update(updatedTransaction);
    expect(result).toEqual(updatedTransaction);
  });

  it('should delete a transaction', async () => {
    await transactionRepository.create(testTransaction);
    await transactionRepository.delete(testTransaction.id);
    const foundTransaction = await transactionRepository.findById(testTransaction.id);
    expect(foundTransaction).toBeNull();
  });

  it('should find transactions by date range', async () => {
    await transactionRepository.create(testTransaction);
    const startDate = new Date('2023-04-30');
    const endDate = new Date('2023-05-02');
    const foundTransactions = await transactionRepository.findByDateRange(testTransaction.accountId, startDate, endDate);
    expect(foundTransactions).toHaveLength(1);
    expect(foundTransactions[0]).toEqual(testTransaction);
  });
});
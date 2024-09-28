import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { MockRequest, MockResponse } from 'jest-mock-express';
import { TransactionController } from '../../controllers/transaction.controller';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';

// Mock TransactionService
jest.mock('../../services/transaction.service');

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let mockTransactionService: jest.Mocked<TransactionService>;

  beforeEach(() => {
    mockTransactionService = new TransactionService() as jest.Mocked<TransactionService>;
    transactionController = new TransactionController(mockTransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTransactions', () => {
    it('should return all transactions for a user', async () => {
      const mockUserId = 'user123';
      const mockTransactions = [
        { id: 'trans1', amount: 100, description: 'Test transaction 1' },
        { id: 'trans2', amount: 200, description: 'Test transaction 2' },
      ];

      mockTransactionService.getAllTransactions.mockResolvedValue(mockTransactions);

      const mockReq = new MockRequest({
        user: { id: mockUserId },
      });
      const mockRes = new MockResponse();

      await transactionController.getAllTransactions(mockReq, mockRes);

      expect(mockTransactionService.getAllTransactions).toHaveBeenCalledWith(mockUserId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockTransactions);
    });
  });

  describe('getTransactionById', () => {
    it('should return a specific transaction for a user', async () => {
      const mockUserId = 'user123';
      const mockTransactionId = 'trans1';
      const mockTransaction = { id: mockTransactionId, amount: 100, description: 'Test transaction' };

      mockTransactionService.getTransactionById.mockResolvedValue(mockTransaction);

      const mockReq = new MockRequest({
        user: { id: mockUserId },
        params: { id: mockTransactionId },
      });
      const mockRes = new MockResponse();

      await transactionController.getTransactionById(mockReq, mockRes);

      expect(mockTransactionService.getTransactionById).toHaveBeenCalledWith(mockUserId, mockTransactionId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockTransaction);
    });
  });

  describe('createTransaction', () => {
    it('should create a new transaction for a user', async () => {
      const mockUserId = 'user123';
      const mockTransactionData = { amount: 100, description: 'New transaction' };
      const mockCreatedTransaction = { id: 'newTrans', ...mockTransactionData };

      mockTransactionService.createTransaction.mockResolvedValue(mockCreatedTransaction);

      const mockReq = new MockRequest({
        user: { id: mockUserId },
        body: mockTransactionData,
      });
      const mockRes = new MockResponse();

      await transactionController.createTransaction(mockReq, mockRes);

      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(mockUserId, mockTransactionData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockCreatedTransaction);
    });
  });

  describe('updateTransaction', () => {
    it('should update an existing transaction for a user', async () => {
      const mockUserId = 'user123';
      const mockTransactionId = 'trans1';
      const mockUpdatedData = { amount: 150, description: 'Updated transaction' };
      const mockUpdatedTransaction = { id: mockTransactionId, ...mockUpdatedData };

      mockTransactionService.updateTransaction.mockResolvedValue(mockUpdatedTransaction);

      const mockReq = new MockRequest({
        user: { id: mockUserId },
        params: { id: mockTransactionId },
        body: mockUpdatedData,
      });
      const mockRes = new MockResponse();

      await transactionController.updateTransaction(mockReq, mockRes);

      expect(mockTransactionService.updateTransaction).toHaveBeenCalledWith(mockUserId, mockTransactionId, mockUpdatedData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedTransaction);
    });
  });

  describe('deleteTransaction', () => {
    it('should delete a transaction for a user', async () => {
      const mockUserId = 'user123';
      const mockTransactionId = 'trans1';

      mockTransactionService.deleteTransaction.mockResolvedValue(undefined);

      const mockReq = new MockRequest({
        user: { id: mockUserId },
        params: { id: mockTransactionId },
      });
      const mockRes = new MockResponse();

      await transactionController.deleteTransaction(mockReq, mockRes);

      expect(mockTransactionService.deleteTransaction).toHaveBeenCalledWith(mockUserId, mockTransactionId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });
  });
});

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let mockTransactionRepository: any;
  let mockAccountService: any;
  let mockCategoryService: any;

  beforeEach(() => {
    mockTransactionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByAccount: jest.fn(),
      findByUserAndDateRange: jest.fn(),
    };

    mockAccountService = {
      updateBalance: jest.fn(),
    };

    mockCategoryService = {
      getCategory: jest.fn(),
      getCategoryByDescription: jest.fn(),
    };

    transactionService = new TransactionService(
      mockTransactionRepository,
      mockAccountService,
      mockCategoryService
    );
  });

  describe('createTransaction', () => {
    it('should create a new transaction and update account balance', async () => {
      const mockUserId = 'user123';
      const mockTransactionData = {
        accountId: 'account1',
        amount: 100,
        description: 'Test transaction',
        categoryId: 'category1',
      };
      const mockCreatedTransaction = { id: 'newTrans', ...mockTransactionData };
      const mockCategory = { id: 'category1', name: 'Test Category' };

      mockTransactionRepository.create.mockResolvedValue(mockCreatedTransaction);
      mockCategoryService.getCategory.mockResolvedValue(mockCategory);

      const result = await transactionService.createTransaction(mockUserId, mockTransactionData);

      expect(mockTransactionRepository.create).toHaveBeenCalledWith(mockTransactionData);
      expect(mockAccountService.updateBalance).toHaveBeenCalledWith(mockTransactionData.accountId, mockTransactionData.amount);
      expect(mockCategoryService.getCategory).toHaveBeenCalledWith(mockTransactionData.categoryId);
      expect(result).toEqual(mockCreatedTransaction);
    });
  });

  describe('getTransactionById', () => {
    it('should return a transaction by id', async () => {
      const mockUserId = 'user123';
      const mockTransactionId = 'trans1';
      const mockTransaction = { id: mockTransactionId, amount: 100, description: 'Test transaction' };

      mockTransactionRepository.findById.mockResolvedValue(mockTransaction);

      const result = await transactionService.getTransactionById(mockUserId, mockTransactionId);

      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(mockTransactionId);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('updateTransaction', () => {
    it('should update a transaction and adjust account balance if amount changed', async () => {
      const mockUserId = 'user123';
      const mockTransactionId = 'trans1';
      const mockOriginalTransaction = { id: mockTransactionId, accountId: 'account1', amount: 100, description: 'Original transaction' };
      const mockUpdatedData = { amount: 150, description: 'Updated transaction' };
      const mockUpdatedTransaction = { ...mockOriginalTransaction, ...mockUpdatedData };

      mockTransactionRepository.findById.mockResolvedValue(mockOriginalTransaction);
      mockTransactionRepository.update.mockResolvedValue(mockUpdatedTransaction);

      const result = await transactionService.updateTransaction(mockUserId, mockTransactionId, mockUpdatedData);

      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(mockTransactionId);
      expect(mockTransactionRepository.update).toHaveBeenCalledWith(mockTransactionId, mockUpdatedData);
      expect(mockAccountService.updateBalance).toHaveBeenCalledWith(mockOriginalTransaction.accountId, mockUpdatedData.amount - mockOriginalTransaction.amount);
      expect(result).toEqual(mockUpdatedTransaction);
    });
  });

  describe('deleteTransaction', () => {
    it('should delete a transaction and reverse the account balance', async () => {
      const mockUserId = 'user123';
      const mockTransactionId = 'trans1';
      const mockTransaction = { id: mockTransactionId, accountId: 'account1', amount: 100 };

      mockTransactionRepository.findById.mockResolvedValue(mockTransaction);

      await transactionService.deleteTransaction(mockUserId, mockTransactionId);

      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(mockTransactionId);
      expect(mockTransactionRepository.delete).toHaveBeenCalledWith(mockTransactionId);
      expect(mockAccountService.updateBalance).toHaveBeenCalledWith(mockTransaction.accountId, -mockTransaction.amount);
    });
  });

  describe('getTransactionsByAccount', () => {
    it('should return transactions for a specific account with pagination', async () => {
      const mockAccountId = 'account1';
      const mockFilters = { startDate: '2023-01-01', endDate: '2023-12-31' };
      const mockPagination = { page: 1, limit: 10 };
      const mockTransactions = [
        { id: 'trans1', amount: 100, description: 'Transaction 1' },
        { id: 'trans2', amount: 200, description: 'Transaction 2' },
      ];
      const mockTotalCount = 2;

      mockTransactionRepository.findByAccount.mockResolvedValue({ transactions: mockTransactions, totalCount: mockTotalCount });

      const result = await transactionService.getTransactionsByAccount(mockAccountId, mockFilters, mockPagination);

      expect(mockTransactionRepository.findByAccount).toHaveBeenCalledWith(mockAccountId, mockFilters, mockPagination);
      expect(result).toEqual({ transactions: mockTransactions, totalCount: mockTotalCount });
    });
  });

  describe('categorizeTransaction', () => {
    it('should categorize a transaction based on its description', async () => {
      const mockTransaction = { id: 'trans1', description: 'Grocery shopping' };
      const mockCategory = { id: 'category1', name: 'Groceries' };

      mockCategoryService.getCategoryByDescription.mockResolvedValue(mockCategory);

      const result = await transactionService.categorizeTransaction(mockTransaction);

      expect(mockCategoryService.getCategoryByDescription).toHaveBeenCalledWith(mockTransaction.description);
      expect(result).toEqual(mockCategory.id);
    });
  });

  describe('generateTransactionInsights', () => {
    it('should generate insights based on user transactions', async () => {
      const mockUserId = 'user123';
      const mockDateRange = { startDate: '2023-01-01', endDate: '2023-12-31' };
      const mockTransactions = [
        { id: 'trans1', amount: 100, categoryId: 'category1', date: '2023-01-15' },
        { id: 'trans2', amount: 200, categoryId: 'category2', date: '2023-02-01' },
        { id: 'trans3', amount: 150, categoryId: 'category1', date: '2023-03-10' },
      ];

      mockTransactionRepository.findByUserAndDateRange.mockResolvedValue(mockTransactions);

      const result = await transactionService.generateTransactionInsights(mockUserId, mockDateRange);

      expect(mockTransactionRepository.findByUserAndDateRange).toHaveBeenCalledWith(mockUserId, mockDateRange);
      expect(result).toHaveProperty('totalSpending');
      expect(result).toHaveProperty('spendingByCategory');
      expect(result).toHaveProperty('averageTransactionAmount');
      // Add more specific assertions based on the expected structure of the insights
    });
  });
});

// Commented list of human tasks
/*
Human tasks:
1. Implement additional test cases for edge cases and error scenarios (Required)
2. Add integration tests for TransactionService with actual database interactions (Optional)
*/
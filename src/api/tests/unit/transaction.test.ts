import { TransactionController } from '../../controllers/transaction.controller';
import { TransactionService } from '../../services/transaction.service';
import { Request, Response } from 'express';

jest.mock('../../services/transaction.service');

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let mockTransactionService: jest.Mocked<TransactionService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockTransactionService = {
      getTransactions: jest.fn(),
      getTransactionById: jest.fn(),
      createTransaction: jest.fn(),
      updateTransaction: jest.fn(),
      deleteTransaction: jest.fn(),
    } as jest.Mocked<TransactionService>;

    transactionController = new TransactionController(mockTransactionService);

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getTransactions', () => {
    it('should return all transactions', async () => {
      const mockTransactions = [{ id: '1', amount: 100 }, { id: '2', amount: 200 }];
      mockTransactionService.getTransactions.mockResolvedValue(mockTransactions);

      await transactionController.getTransactions(mockRequest as Request, mockResponse as Response);

      expect(mockTransactionService.getTransactions).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTransactions);
    });

    // Add test for pagination and filtering
    it('should handle pagination and filtering', async () => {
      mockRequest.query = { page: '1', limit: '10', category: 'food' };
      const mockTransactions = [{ id: '1', amount: 100, category: 'food' }];
      mockTransactionService.getTransactions.mockResolvedValue(mockTransactions);

      await transactionController.getTransactions(mockRequest as Request, mockResponse as Response);

      expect(mockTransactionService.getTransactions).toHaveBeenCalledWith(1, 10, 'food');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTransactions);
    });
  });

  describe('getTransactionById', () => {
    it('should return a transaction by id', async () => {
      const mockTransaction = { id: '1', amount: 100 };
      mockRequest.params = { id: '1' };
      mockTransactionService.getTransactionById.mockResolvedValue(mockTransaction);

      await transactionController.getTransactionById(mockRequest as Request, mockResponse as Response);

      expect(mockTransactionService.getTransactionById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTransaction);
    });

    it('should return 404 if transaction is not found', async () => {
      mockRequest.params = { id: '1' };
      mockTransactionService.getTransactionById.mockResolvedValue(null);

      await transactionController.getTransactionById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Transaction not found' });
    });
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      const mockTransaction = { id: '1', amount: 100, description: 'Test' };
      mockRequest.body = { amount: 100, description: 'Test' };
      mockTransactionService.createTransaction.mockResolvedValue(mockTransaction);

      await transactionController.createTransaction(mockRequest as Request, mockResponse as Response);

      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTransaction);
    });

    // Add test for input validation
    it('should return 400 if input is invalid', async () => {
      mockRequest.body = { amount: 'invalid' };

      await transactionController.createTransaction(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid input' });
    });
  });

  describe('updateTransaction', () => {
    it('should update an existing transaction', async () => {
      const mockTransaction = { id: '1', amount: 200, description: 'Updated' };
      mockRequest.params = { id: '1' };
      mockRequest.body = { amount: 200, description: 'Updated' };
      mockTransactionService.updateTransaction.mockResolvedValue(mockTransaction);

      await transactionController.updateTransaction(mockRequest as Request, mockResponse as Response);

      expect(mockTransactionService.updateTransaction).toHaveBeenCalledWith('1', mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTransaction);
    });

    // Add test for input validation
    it('should return 400 if input is invalid', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { amount: 'invalid' };

      await transactionController.updateTransaction(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid input' });
    });
  });

  describe('deleteTransaction', () => {
    it('should delete an existing transaction', async () => {
      mockRequest.params = { id: '1' };
      mockTransactionService.deleteTransaction.mockResolvedValue(true);

      await transactionController.deleteTransaction(mockRequest as Request, mockResponse as Response);

      expect(mockTransactionService.deleteTransaction).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.json).toHaveBeenCalledWith();
    });

    it('should return 404 if transaction to delete is not found', async () => {
      mockRequest.params = { id: '1' };
      mockTransactionService.deleteTransaction.mockResolvedValue(false);

      await transactionController.deleteTransaction(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Transaction not found' });
    });
  });

  // Add test for error handling scenarios
  describe('Error handling', () => {
    it('should handle errors and return 500 status', async () => {
      mockTransactionService.getTransactions.mockRejectedValue(new Error('Database error'));

      await transactionController.getTransactions(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});

// TODO: Implement test cases for authentication middleware integration
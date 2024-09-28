import { AccountController } from '../../controllers/account.controller';
import { AccountService } from '../../services/account.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

jest.mock('../../services/account.service');

describe('AccountController', () => {
  let accountController: AccountController;
  let mockAccountService: jest.Mocked<AccountService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockAccountService = {
      createAccount: jest.fn(),
      getAccounts: jest.fn(),
      getAccountById: jest.fn(),
      updateAccount: jest.fn(),
      deleteAccount: jest.fn(),
      synchronizeAccount: jest.fn(),
    } as any;

    accountController = new AccountController(mockAccountService);

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('createAccount', () => {
    it('should create a new account and return 201 status', async () => {
      const mockAccountData = { name: 'Test Account', balance: 1000 };
      mockRequest.body = mockAccountData;
      mockAccountService.createAccount.mockResolvedValue({ id: '1', ...mockAccountData });

      await accountController.createAccount(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAccountService.createAccount).toHaveBeenCalledWith(mockAccountData);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: '1', ...mockAccountData });
    });

    // Add more test cases for error scenarios
  });

  describe('getAccounts', () => {
    it('should return all accounts with 200 status', async () => {
      const mockAccounts = [{ id: '1', name: 'Account 1' }, { id: '2', name: 'Account 2' }];
      mockAccountService.getAccounts.mockResolvedValue(mockAccounts);

      await accountController.getAccounts(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAccountService.getAccounts).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAccounts);
    });

    // Add more test cases for error scenarios
  });

  describe('getAccountById', () => {
    it('should return a specific account with 200 status', async () => {
      const mockAccount = { id: '1', name: 'Test Account' };
      mockRequest.params = { id: '1' };
      mockAccountService.getAccountById.mockResolvedValue(mockAccount);

      await accountController.getAccountById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAccountService.getAccountById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAccount);
    });

    // Add more test cases for error scenarios
  });

  describe('updateAccount', () => {
    it('should update an account and return 200 status', async () => {
      const mockAccountData = { name: 'Updated Account', balance: 2000 };
      mockRequest.params = { id: '1' };
      mockRequest.body = mockAccountData;
      mockAccountService.updateAccount.mockResolvedValue({ id: '1', ...mockAccountData });

      await accountController.updateAccount(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAccountService.updateAccount).toHaveBeenCalledWith('1', mockAccountData);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: '1', ...mockAccountData });
    });

    // Add more test cases for error scenarios
  });

  describe('deleteAccount', () => {
    it('should delete an account and return 204 status', async () => {
      mockRequest.params = { id: '1' };
      mockAccountService.deleteAccount.mockResolvedValue(undefined);

      await accountController.deleteAccount(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAccountService.deleteAccount).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
      expect(mockResponse.json).toHaveBeenCalledWith();
    });

    // Add more test cases for error scenarios
  });

  describe('synchronizeAccount', () => {
    it('should synchronize an account and return 200 status', async () => {
      mockRequest.params = { id: '1' };
      const mockSyncResult = { status: 'success', message: 'Account synchronized' };
      mockAccountService.synchronizeAccount.mockResolvedValue(mockSyncResult);

      await accountController.synchronizeAccount(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAccountService.synchronizeAccount).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSyncResult);
    });

    // Add more test cases for error scenarios
  });

  // Add tests for error handling middleware
  describe('Error handling', () => {
    it('should call next with an error if an exception is thrown', async () => {
      const error = new Error('Test error');
      mockAccountService.getAccounts.mockRejectedValue(error);

      await accountController.getAccounts(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

// TODO: Implement test cases for error scenarios and edge cases
// TODO: Add test cases for input validation
// TODO: Implement test cases for authentication middleware
import { InvestmentController } from '../../controllers/investment.controller';
import { InvestmentService } from '../../services/investment.service';
import { InvestmentModel } from '../../models/investment.model';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

jest.mock('../../services/investment.service');

describe('InvestmentController', () => {
  let investmentController: InvestmentController;
  let mockInvestmentService: jest.Mocked<InvestmentService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockInvestmentService = {
      getInvestmentAccounts: jest.fn(),
      getInvestmentAccountById: jest.fn(),
      createInvestmentAccount: jest.fn(),
      updateInvestmentAccount: jest.fn(),
      deleteInvestmentAccount: jest.fn(),
      getInvestmentAssets: jest.fn(),
      addInvestmentAsset: jest.fn(),
      getInvestmentPerformance: jest.fn(),
    } as jest.Mocked<InvestmentService>;

    investmentController = new InvestmentController(mockInvestmentService);

    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getInvestmentAccounts', () => {
    it('should return investment accounts for a user', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const mockAccounts = [{ id: '1', name: 'Account 1' }, { id: '2', name: 'Account 2' }];

      mockRequest.params = { userId };
      mockInvestmentService.getInvestmentAccounts.mockResolvedValue(mockAccounts);

      await investmentController.getInvestmentAccounts(mockRequest as Request, mockResponse as Response);

      expect(mockInvestmentService.getInvestmentAccounts).toHaveBeenCalledWith(userId);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAccounts);
    });
  });

  describe('getInvestmentAccountById', () => {
    it('should return a specific investment account', async () => {
      const accountId = new mongoose.Types.ObjectId().toString();
      const mockAccount = { id: accountId, name: 'Test Account' };

      mockRequest.params = { accountId };
      mockInvestmentService.getInvestmentAccountById.mockResolvedValue(mockAccount);

      await investmentController.getInvestmentAccountById(mockRequest as Request, mockResponse as Response);

      expect(mockInvestmentService.getInvestmentAccountById).toHaveBeenCalledWith(accountId);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAccount);
    });
  });

  describe('createInvestmentAccount', () => {
    it('should create a new investment account', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const accountData = { name: 'New Account', balance: 10000 };
      const createdAccount = { id: '1', ...accountData };

      mockRequest.body = { userId, ...accountData };
      mockInvestmentService.createInvestmentAccount.mockResolvedValue(createdAccount);

      await investmentController.createInvestmentAccount(mockRequest as Request, mockResponse as Response);

      expect(mockInvestmentService.createInvestmentAccount).toHaveBeenCalledWith(userId, accountData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdAccount);
    });
  });

  describe('updateInvestmentAccount', () => {
    it('should update an existing investment account', async () => {
      const accountId = new mongoose.Types.ObjectId().toString();
      const updateData = { name: 'Updated Account' };
      const updatedAccount = { id: accountId, ...updateData };

      mockRequest.params = { accountId };
      mockRequest.body = updateData;
      mockInvestmentService.updateInvestmentAccount.mockResolvedValue(updatedAccount);

      await investmentController.updateInvestmentAccount(mockRequest as Request, mockResponse as Response);

      expect(mockInvestmentService.updateInvestmentAccount).toHaveBeenCalledWith(accountId, updateData);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedAccount);
    });
  });

  describe('deleteInvestmentAccount', () => {
    it('should delete an investment account', async () => {
      const accountId = new mongoose.Types.ObjectId().toString();

      mockRequest.params = { accountId };
      mockInvestmentService.deleteInvestmentAccount.mockResolvedValue(true);

      await investmentController.deleteInvestmentAccount(mockRequest as Request, mockResponse as Response);

      expect(mockInvestmentService.deleteInvestmentAccount).toHaveBeenCalledWith(accountId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Investment account deleted successfully' });
    });
  });

  describe('getInvestmentAssets', () => {
    it('should return investment assets for an account', async () => {
      const accountId = new mongoose.Types.ObjectId().toString();
      const mockAssets = [{ id: '1', name: 'Asset 1' }, { id: '2', name: 'Asset 2' }];

      mockRequest.params = { accountId };
      mockInvestmentService.getInvestmentAssets.mockResolvedValue(mockAssets);

      await investmentController.getInvestmentAssets(mockRequest as Request, mockResponse as Response);

      expect(mockInvestmentService.getInvestmentAssets).toHaveBeenCalledWith(accountId);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAssets);
    });
  });

  describe('addInvestmentAsset', () => {
    it('should add a new investment asset to an account', async () => {
      const accountId = new mongoose.Types.ObjectId().toString();
      const assetData = { name: 'New Asset', value: 5000 };
      const addedAsset = { id: '1', ...assetData };

      mockRequest.params = { accountId };
      mockRequest.body = assetData;
      mockInvestmentService.addInvestmentAsset.mockResolvedValue(addedAsset);

      await investmentController.addInvestmentAsset(mockRequest as Request, mockResponse as Response);

      expect(mockInvestmentService.addInvestmentAsset).toHaveBeenCalledWith(accountId, assetData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(addedAsset);
    });
  });

  describe('getInvestmentPerformance', () => {
    it('should return investment performance metrics', async () => {
      const accountId = new mongoose.Types.ObjectId().toString();
      const mockPerformance = { totalReturn: 1000, annualizedReturn: 0.05 };

      mockRequest.params = { accountId };
      mockRequest.query = { startDate: '2023-01-01', endDate: '2023-12-31' };
      mockInvestmentService.getInvestmentPerformance.mockResolvedValue(mockPerformance);

      await investmentController.getInvestmentPerformance(mockRequest as Request, mockResponse as Response);

      expect(mockInvestmentService.getInvestmentPerformance).toHaveBeenCalledWith(accountId, { startDate: '2023-01-01', endDate: '2023-12-31' });
      expect(mockResponse.json).toHaveBeenCalledWith(mockPerformance);
    });
  });
});

// TODO: Implement error case tests for each controller function
// TODO: Add tests for input validation and error handling middleware
// TODO: Implement integration tests that use a test database
// TODO: Add tests for pagination in list endpoints (getInvestmentAccounts, getInvestmentAssets)
// TODO: Implement tests for rate limiting and authentication middleware
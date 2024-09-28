import { InvestmentService } from '../../services/investment.service';
import { InvestmentModel } from '../../models/investment.model';
import { InvestmentDataProviderInterface } from '../../interfaces/investmentDataProvider.interface';
import { InvestmentDataService } from '../../services/external/investmentData.service';
import { createMock } from '@golevelup/ts-jest';
import { Logger } from 'winston';

describe('InvestmentService', () => {
  let investmentService: InvestmentService;
  let mockInvestmentModel: jest.Mocked<typeof InvestmentModel>;
  let mockInvestmentDataProvider: jest.Mocked<InvestmentDataProviderInterface>;
  let mockInvestmentDataService: jest.Mocked<InvestmentDataService>;
  let mockLogger: jest.Mocked<Logger>;

  const setupTestEnvironment = () => {
    mockInvestmentModel = createMock<typeof InvestmentModel>();
    mockInvestmentDataProvider = createMock<InvestmentDataProviderInterface>();
    mockInvestmentDataService = createMock<InvestmentDataService>();
    mockLogger = createMock<Logger>();

    investmentService = new InvestmentService(
      mockInvestmentModel as any,
      mockInvestmentDataProvider,
      mockInvestmentDataService,
      mockLogger
    );

    return {
      mockInvestmentModel,
      mockInvestmentDataProvider,
      mockInvestmentDataService,
      mockLogger,
      investmentService,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserInvestments', () => {
    it('should return an array of user investments', async () => {
      const { investmentService, mockInvestmentModel } = setupTestEnvironment();
      const userId = 'user123';
      const mockInvestments = [{ id: 'inv1', name: 'Investment 1' }, { id: 'inv2', name: 'Investment 2' }];

      mockInvestmentModel.findAll.mockResolvedValue(mockInvestments as any);

      const result = await investmentService.getUserInvestments(userId);

      expect(result).toEqual(mockInvestments);
      expect(mockInvestmentModel.findAll).toHaveBeenCalledWith({ where: { userId } });
    });
  });

  describe('getInvestmentById', () => {
    it('should return a specific investment', async () => {
      const { investmentService, mockInvestmentModel } = setupTestEnvironment();
      const investmentId = 'inv123';
      const mockInvestment = { id: investmentId, name: 'Test Investment' };

      mockInvestmentModel.findByPk.mockResolvedValue(mockInvestment as any);

      const result = await investmentService.getInvestmentById(investmentId);

      expect(result).toEqual(mockInvestment);
      expect(mockInvestmentModel.findByPk).toHaveBeenCalledWith(investmentId);
    });
  });

  describe('addInvestment', () => {
    it('should create and return a new investment', async () => {
      const { investmentService, mockInvestmentModel } = setupTestEnvironment();
      const userId = 'user123';
      const investmentData = { name: 'New Investment', amount: 1000 };
      const mockCreatedInvestment = { id: 'newInv', ...investmentData };

      mockInvestmentModel.create.mockResolvedValue(mockCreatedInvestment as any);

      const result = await investmentService.addInvestment(userId, investmentData);

      expect(result).toEqual(mockCreatedInvestment);
      expect(mockInvestmentModel.create).toHaveBeenCalledWith({ userId, ...investmentData });
    });
  });

  describe('updateInvestment', () => {
    it('should update and return the modified investment', async () => {
      const { investmentService, mockInvestmentModel } = setupTestEnvironment();
      const investmentId = 'inv123';
      const updateData = { name: 'Updated Investment' };
      const mockUpdatedInvestment = { id: investmentId, ...updateData };

      mockInvestmentModel.update.mockResolvedValue([1]);
      mockInvestmentModel.findByPk.mockResolvedValue(mockUpdatedInvestment as any);

      const result = await investmentService.updateInvestment(investmentId, updateData);

      expect(result).toEqual(mockUpdatedInvestment);
      expect(mockInvestmentModel.update).toHaveBeenCalledWith(updateData, { where: { id: investmentId } });
      expect(mockInvestmentModel.findByPk).toHaveBeenCalledWith(investmentId);
    });
  });

  describe('deleteInvestment', () => {
    it('should delete the specified investment', async () => {
      const { investmentService, mockInvestmentModel } = setupTestEnvironment();
      const investmentId = 'inv123';

      mockInvestmentModel.destroy.mockResolvedValue(1);

      const result = await investmentService.deleteInvestment(investmentId);

      expect(result).toBe(true);
      expect(mockInvestmentModel.destroy).toHaveBeenCalledWith({ where: { id: investmentId } });
    });
  });

  describe('syncInvestments', () => {
    it('should update local investments with external data', async () => {
      const { investmentService, mockInvestmentDataProvider, mockInvestmentModel } = setupTestEnvironment();
      const userId = 'user123';
      const mockExternalInvestments = [{ id: 'ext1', name: 'External Investment 1' }];

      mockInvestmentDataProvider.getInvestments.mockResolvedValue(mockExternalInvestments);
      mockInvestmentModel.bulkCreate.mockResolvedValue(mockExternalInvestments as any);

      await investmentService.syncInvestments(userId);

      expect(mockInvestmentDataProvider.getInvestments).toHaveBeenCalledWith(userId);
      expect(mockInvestmentModel.bulkCreate).toHaveBeenCalledWith(mockExternalInvestments, {
        updateOnDuplicate: ['name', 'amount', 'lastUpdated'],
      });
    });
  });

  describe('getInvestmentPerformance', () => {
    it('should calculate and return performance metrics', async () => {
      const { investmentService, mockInvestmentModel } = setupTestEnvironment();
      const investmentId = 'inv123';
      const mockInvestment = { id: investmentId, name: 'Test Investment', initialAmount: 1000, currentAmount: 1200 };

      mockInvestmentModel.findByPk.mockResolvedValue(mockInvestment as any);

      const result = await investmentService.getInvestmentPerformance(investmentId);

      expect(result).toHaveProperty('roi');
      expect(result).toHaveProperty('annualizedReturn');
      expect(mockInvestmentModel.findByPk).toHaveBeenCalledWith(investmentId);
    });
  });

  describe('getPortfolioAllocation', () => {
    it('should return the user\'s portfolio allocation', async () => {
      const { investmentService, mockInvestmentModel } = setupTestEnvironment();
      const userId = 'user123';
      const mockInvestments = [
        { id: 'inv1', name: 'Investment 1', amount: 1000, type: 'stocks' },
        { id: 'inv2', name: 'Investment 2', amount: 500, type: 'bonds' },
      ];

      mockInvestmentModel.findAll.mockResolvedValue(mockInvestments as any);

      const result = await investmentService.getPortfolioAllocation(userId);

      expect(result).toHaveProperty('stocks');
      expect(result).toHaveProperty('bonds');
      expect(mockInvestmentModel.findAll).toHaveBeenCalledWith({ where: { userId } });
    });
  });
});

// Human tasks:
// TODO: Implement additional test cases for edge cases and error scenarios
// TODO: Ensure test coverage is at least 80% for the InvestmentService
// TODO: Add integration tests for InvestmentService with actual database connections
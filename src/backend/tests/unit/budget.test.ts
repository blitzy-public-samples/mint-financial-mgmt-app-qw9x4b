import { BudgetService } from '../../services/budget.service';
import { BudgetController } from '../../controllers/budget.controller';
import { Budget } from '../../models/budget.model';
import { validateBudgetData } from '../../utils/validation.util';
import { MockRepository } from 'typeorm';

jest.mock('../../utils/validation.util');

describe('BudgetService', () => {
  let budgetService: BudgetService;
  let mockBudgetRepository: MockRepository<Budget>;

  beforeEach(() => {
    mockBudgetRepository = createMockBudgetRepository();
    budgetService = new BudgetService(mockBudgetRepository);
  });

  it('should create a new budget', async () => {
    const budgetData = {
      userId: '123',
      categoryId: '456',
      amount: 1000,
      period: 'monthly',
      startDate: new Date(),
      endDate: new Date(),
    };

    (validateBudgetData as jest.Mock).mockReturnValue(true);

    const createdBudget = await budgetService.createBudget(budgetData);

    expect(validateBudgetData).toHaveBeenCalledWith(budgetData);
    expect(mockBudgetRepository.save).toHaveBeenCalledWith(expect.objectContaining(budgetData));
    expect(createdBudget).toMatchObject(budgetData);
  });

  it('should retrieve a budget by ID', async () => {
    const budgetId = '789';
    const userId = '123';
    const mockBudget = { id: budgetId, userId, amount: 1000 };

    mockBudgetRepository.findOne.mockResolvedValue(mockBudget);

    const retrievedBudget = await budgetService.getBudget(budgetId, userId);

    expect(mockBudgetRepository.findOne).toHaveBeenCalledWith({ where: { id: budgetId, userId } });
    expect(retrievedBudget).toEqual(mockBudget);
  });

  it('should retrieve all budgets for a user', async () => {
    const userId = '123';
    const mockBudgets = [
      { id: '1', userId, amount: 1000 },
      { id: '2', userId, amount: 2000 },
    ];

    mockBudgetRepository.find.mockResolvedValue(mockBudgets);

    const retrievedBudgets = await budgetService.getUserBudgets(userId);

    expect(mockBudgetRepository.find).toHaveBeenCalledWith({ where: { userId } });
    expect(retrievedBudgets).toEqual(mockBudgets);
  });

  it('should update an existing budget', async () => {
    const budgetId = '789';
    const userId = '123';
    const updateData = { amount: 1500 };
    const existingBudget = { id: budgetId, userId, amount: 1000 };
    const updatedBudget = { ...existingBudget, ...updateData };

    (validateBudgetData as jest.Mock).mockReturnValue(true);
    mockBudgetRepository.findOne.mockResolvedValue(existingBudget);
    mockBudgetRepository.save.mockResolvedValue(updatedBudget);

    const result = await budgetService.updateBudget(budgetId, userId, updateData);

    expect(validateBudgetData).toHaveBeenCalledWith(updateData);
    expect(mockBudgetRepository.findOne).toHaveBeenCalledWith({ where: { id: budgetId, userId } });
    expect(mockBudgetRepository.save).toHaveBeenCalledWith(updatedBudget);
    expect(result).toEqual(updatedBudget);
  });

  it('should delete a budget', async () => {
    const budgetId = '789';
    const userId = '123';
    const existingBudget = { id: budgetId, userId, amount: 1000 };

    mockBudgetRepository.findOne.mockResolvedValue(existingBudget);

    await budgetService.deleteBudget(budgetId, userId);

    expect(mockBudgetRepository.findOne).toHaveBeenCalledWith({ where: { id: budgetId, userId } });
    expect(mockBudgetRepository.remove).toHaveBeenCalledWith(existingBudget);
  });

  it('should calculate budget progress', async () => {
    const budgetId = '789';
    const userId = '123';
    const mockBudget = { id: budgetId, userId, amount: 1000, categoryId: '456' };
    const mockTransactions = [
      { amount: 200, categoryId: '456' },
      { amount: 300, categoryId: '456' },
    ];

    mockBudgetRepository.findOne.mockResolvedValue(mockBudget);
    const mockTransactionRepository = {
      find: jest.fn().mockResolvedValue(mockTransactions),
    };

    budgetService = new BudgetService(mockBudgetRepository, mockTransactionRepository as any);

    const progress = await budgetService.calculateBudgetProgress(budgetId, userId);

    expect(mockBudgetRepository.findOne).toHaveBeenCalledWith({ where: { id: budgetId, userId } });
    expect(mockTransactionRepository.find).toHaveBeenCalledWith({
      where: { userId, categoryId: mockBudget.categoryId },
    });
    expect(progress).toEqual({
      budget: mockBudget,
      spent: 500,
      remaining: 500,
      percentage: 50,
    });
  });
});

describe('BudgetController', () => {
  let budgetController: BudgetController;
  let mockBudgetService: jest.Mocked<BudgetService>;

  beforeEach(() => {
    mockBudgetService = {
      createBudget: jest.fn(),
      getUserBudgets: jest.fn(),
      getBudget: jest.fn(),
      updateBudget: jest.fn(),
      deleteBudget: jest.fn(),
      calculateBudgetProgress: jest.fn(),
    } as any;

    budgetController = new BudgetController(mockBudgetService);
  });

  it('should create a new budget and return 201 status', async () => {
    const budgetData = { amount: 1000, categoryId: '456' };
    const req = { body: budgetData, user: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const createdBudget = { id: '789', ...budgetData, userId: '123' };
    mockBudgetService.createBudget.mockResolvedValue(createdBudget);

    await budgetController.createBudget(req as any, res as any);

    expect(mockBudgetService.createBudget).toHaveBeenCalledWith({ ...budgetData, userId: '123' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdBudget);
  });

  it('should retrieve all budgets for a user and return 200 status', async () => {
    const req = { user: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockBudgets = [{ id: '1', amount: 1000 }, { id: '2', amount: 2000 }];
    mockBudgetService.getUserBudgets.mockResolvedValue(mockBudgets);

    await budgetController.getBudgets(req as any, res as any);

    expect(mockBudgetService.getUserBudgets).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockBudgets);
  });

  it('should retrieve a specific budget by ID and return 200 status', async () => {
    const req = { params: { id: '789' }, user: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockBudget = { id: '789', amount: 1000, userId: '123' };
    mockBudgetService.getBudget.mockResolvedValue(mockBudget);

    await budgetController.getBudgetById(req as any, res as any);

    expect(mockBudgetService.getBudget).toHaveBeenCalledWith('789', '123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockBudget);
  });

  it('should update a budget and return 200 status', async () => {
    const updateData = { amount: 1500 };
    const req = { params: { id: '789' }, body: updateData, user: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const updatedBudget = { id: '789', ...updateData, userId: '123' };
    mockBudgetService.updateBudget.mockResolvedValue(updatedBudget);

    await budgetController.updateBudget(req as any, res as any);

    expect(mockBudgetService.updateBudget).toHaveBeenCalledWith('789', '123', updateData);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedBudget);
  });

  it('should delete a budget and return 204 status', async () => {
    const req = { params: { id: '789' }, user: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await budgetController.deleteBudget(req as any, res as any);

    expect(mockBudgetService.deleteBudget).toHaveBeenCalledWith('789', '123');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('should retrieve budget progress and return 200 status', async () => {
    const req = { params: { id: '789' }, user: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockProgress = { budget: { id: '789', amount: 1000 }, spent: 500, remaining: 500, percentage: 50 };
    mockBudgetService.calculateBudgetProgress.mockResolvedValue(mockProgress);

    await budgetController.getBudgetProgress(req as any, res as any);

    expect(mockBudgetService.calculateBudgetProgress).toHaveBeenCalledWith('789', '123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockProgress);
  });
});

function createMockBudgetRepository(): MockRepository<Budget> {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
  } as any;
}

// Pending human tasks:
// 1. Implement error handling tests for each method in BudgetService and BudgetController
// 2. Add tests for input validation in BudgetController methods
// 3. Create tests for edge cases and boundary conditions in budget calculations
// 4. Implement integration tests that cover the interaction between BudgetService and the actual database
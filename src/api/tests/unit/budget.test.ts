import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals';
import { Request, Response } from 'express';
import * as budgetController from '../../controllers/budget.controller';
import { BudgetService } from '../../services/budget.service';

// Mock the BudgetService
jest.mock('../../services/budget.service');

describe('Budget Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockBudgetService: jest.Mocked<BudgetService>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    };
    mockBudgetService = {
      createBudget: jest.fn(),
      getBudgets: jest.fn(),
      getBudgetById: jest.fn(),
      updateBudget: jest.fn(),
      deleteBudget: jest.fn(),
    } as unknown as jest.Mocked<BudgetService>;

    // Inject the mocked BudgetService into the controller
    (budgetController as any).budgetService = mockBudgetService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createBudget should create a new budget', async () => {
    const budgetData = { category: 'Food', amount: 500, period: 'monthly' };
    mockRequest.body = budgetData;
    const createdBudget = { id: '1', ...budgetData };
    mockBudgetService.createBudget.mockResolvedValue(createdBudget);

    await budgetController.createBudget(mockRequest as Request, mockResponse as Response);

    expect(mockBudgetService.createBudget).toHaveBeenCalledWith(budgetData);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(createdBudget);
  });

  test('getBudgets should return all budgets', async () => {
    const budgets = [
      { id: '1', category: 'Food', amount: 500, period: 'monthly' },
      { id: '2', category: 'Transportation', amount: 200, period: 'monthly' },
    ];
    mockBudgetService.getBudgets.mockResolvedValue(budgets);

    await budgetController.getBudgets(mockRequest as Request, mockResponse as Response);

    expect(mockBudgetService.getBudgets).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(budgets);
  });

  test('getBudgetById should return a specific budget', async () => {
    const budgetId = '1';
    mockRequest.params = { id: budgetId };
    const budget = { id: budgetId, category: 'Food', amount: 500, period: 'monthly' };
    mockBudgetService.getBudgetById.mockResolvedValue(budget);

    await budgetController.getBudgetById(mockRequest as Request, mockResponse as Response);

    expect(mockBudgetService.getBudgetById).toHaveBeenCalledWith(budgetId);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(budget);
  });

  test('updateBudget should update an existing budget', async () => {
    const budgetId = '1';
    const updatedBudgetData = { category: 'Food', amount: 600, period: 'monthly' };
    mockRequest.params = { id: budgetId };
    mockRequest.body = updatedBudgetData;
    const updatedBudget = { id: budgetId, ...updatedBudgetData };
    mockBudgetService.updateBudget.mockResolvedValue(updatedBudget);

    await budgetController.updateBudget(mockRequest as Request, mockResponse as Response);

    expect(mockBudgetService.updateBudget).toHaveBeenCalledWith(budgetId, updatedBudgetData);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(updatedBudget);
  });

  test('deleteBudget should delete an existing budget', async () => {
    const budgetId = '1';
    mockRequest.params = { id: budgetId };
    mockBudgetService.deleteBudget.mockResolvedValue(undefined);

    await budgetController.deleteBudget(mockRequest as Request, mockResponse as Response);

    expect(mockBudgetService.deleteBudget).toHaveBeenCalledWith(budgetId);
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.end).toHaveBeenCalled();
  });
});

// Human tasks:
// TODO: Implement error handling tests for each controller function
// TODO: Add tests for input validation in createBudget and updateBudget functions
// TODO: Implement tests for pagination in getBudgets function
// TODO: Add tests for authentication middleware
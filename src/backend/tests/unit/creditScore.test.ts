import { describe, it, expect, jest } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';
import { CreditScoreService } from '../../services/creditScore.service';
import { CreditScore } from '../../models/creditScore.model';

describe('CreditScoreService', () => {
  let creditScoreService: CreditScoreService;
  let creditBureauServiceMock: MockProxy<any>;
  let loggerMock: MockProxy<any>;

  beforeEach(() => {
    // Set up mocks for CreditBureauService and Logger
    creditBureauServiceMock = mock<any>();
    loggerMock = mock<any>();

    // Create an instance of CreditScoreService with mocked dependencies
    creditScoreService = new CreditScoreService(creditBureauServiceMock, loggerMock);
  });

  it('should fetch credit score successfully', async () => {
    const userId = 'testUserId';
    const mockCreditScore: CreditScore = {
      userId,
      score: 750,
      date: new Date(),
      factors: ['Payment History', 'Credit Utilization']
    };

    creditBureauServiceMock.fetchCreditScore.mockResolvedValue(mockCreditScore);

    const result = await creditScoreService.getCreditScore(userId);

    expect(result).toEqual(mockCreditScore);
    expect(creditBureauServiceMock.fetchCreditScore).toHaveBeenCalledWith(userId);
    expect(loggerMock.info).toHaveBeenCalledWith(`Credit score fetched for user ${userId}`);
  });

  it('should handle errors when fetching credit score', async () => {
    const userId = 'testUserId';
    const error = new Error('Failed to fetch credit score');

    creditBureauServiceMock.fetchCreditScore.mockRejectedValue(error);

    await expect(creditScoreService.getCreditScore(userId)).rejects.toThrow('Failed to fetch credit score');
    expect(loggerMock.error).toHaveBeenCalledWith(`Error fetching credit score for user ${userId}`, error);
  });

  // Add more test cases here as needed

  // Pending human tasks:
  // TODO: Implement test cases for error handling scenarios
  // TODO: Add test cases for rate limiting functionality once implemented
  // TODO: Create test cases for caching mechanism once implemented
});
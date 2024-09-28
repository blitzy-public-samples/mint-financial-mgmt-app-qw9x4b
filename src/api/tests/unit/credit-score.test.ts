import { describe, it, expect, jest } from '@jest/globals';
import { MockRequest, MockResponse } from 'jest-mock-express';
import { StatusCodes } from 'http-status-codes';
import { getCreditScore, getCreditScoreHistory, getCreditScoreFactors, refreshCreditScore } from '../../controllers/credit-score.controller';
import CreditScoreService from '../../services/credit-score.service';
import { CreditScore, CreditScoreHistory, CreditScoreFactors } from '../../../shared/types/creditScore';

jest.mock('../../services/credit-score.service');

describe('Credit Score Controller', () => {
  const mockUserId = '123456';

  describe('getCreditScore', () => {
    it('should return credit score data with status 200', async () => {
      const mockCreditScore: CreditScore = {
        score: 750,
        date: new Date(),
      };

      (CreditScoreService.getCreditScore as jest.Mock).mockResolvedValue(mockCreditScore);

      const req = new MockRequest({
        user: { id: mockUserId },
      });
      const res = new MockResponse();

      await getCreditScore(req as any, res as any);

      expect(CreditScoreService.getCreditScore).toHaveBeenCalledWith(mockUserId);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockCreditScore);
    });
  });

  describe('getCreditScoreHistory', () => {
    it('should return credit score history data with status 200', async () => {
      const mockCreditScoreHistory: CreditScoreHistory = [
        { score: 750, date: new Date('2023-01-01') },
        { score: 760, date: new Date('2023-02-01') },
        { score: 755, date: new Date('2023-03-01') },
      ];

      (CreditScoreService.getCreditScoreHistory as jest.Mock).mockResolvedValue(mockCreditScoreHistory);

      const req = new MockRequest({
        user: { id: mockUserId },
      });
      const res = new MockResponse();

      await getCreditScoreHistory(req as any, res as any);

      expect(CreditScoreService.getCreditScoreHistory).toHaveBeenCalledWith(mockUserId);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockCreditScoreHistory);
    });
  });

  describe('getCreditScoreFactors', () => {
    it('should return credit score factors data with status 200', async () => {
      const mockCreditScoreFactors: CreditScoreFactors = [
        { factor: 'Payment History', impact: 'High', description: 'Your payment history is excellent.' },
        { factor: 'Credit Utilization', impact: 'Medium', description: 'Your credit utilization is good, but could be improved.' },
      ];

      (CreditScoreService.getCreditScoreFactors as jest.Mock).mockResolvedValue(mockCreditScoreFactors);

      const req = new MockRequest({
        user: { id: mockUserId },
      });
      const res = new MockResponse();

      await getCreditScoreFactors(req as any, res as any);

      expect(CreditScoreService.getCreditScoreFactors).toHaveBeenCalledWith(mockUserId);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockCreditScoreFactors);
    });
  });

  describe('refreshCreditScore', () => {
    it('should return success message with status 202', async () => {
      (CreditScoreService.refreshCreditScore as jest.Mock).mockResolvedValue(undefined);

      const req = new MockRequest({
        user: { id: mockUserId },
      });
      const res = new MockResponse();

      await refreshCreditScore(req as any, res as any);

      expect(CreditScoreService.refreshCreditScore).toHaveBeenCalledWith(mockUserId);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.ACCEPTED);
      expect(res.json).toHaveBeenCalledWith({ message: 'Credit score refresh initiated' });
    });
  });

  describe('Error Handling', () => {
    it('should pass errors to the next middleware', async () => {
      const mockError = new Error('Test error');
      (CreditScoreService.getCreditScore as jest.Mock).mockRejectedValue(mockError);

      const req = new MockRequest({
        user: { id: mockUserId },
      });
      const res = new MockResponse();
      const next = jest.fn();

      await getCreditScore(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});

// Human tasks:
// TODO: Implement mock data for CreditScore, CreditScoreHistory, and CreditScoreFactors types
// TODO: Add more edge case tests, such as handling empty credit score history
// TODO: Implement tests for input validation and error cases
// TODO: Add tests for rate limiting on the refreshCreditScore function
// TODO: Consider adding integration tests that use a test database
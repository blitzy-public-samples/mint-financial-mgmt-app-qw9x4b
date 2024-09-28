import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { CreditScoreOverview } from '../../components/CreditScore/CreditScoreOverview';
import { useCreditScore } from '../../hooks/useCreditScore';
import { CreditScoreData } from '../../types/creditScore.types';

// Mock the useCreditScore hook
jest.mock('../../hooks/useCreditScore');

describe('CreditScoreOverview', () => {
  const mockCreditScoreData: CreditScoreData = {
    score: 750,
    history: [
      { date: '2023-01-01', score: 720 },
      { date: '2023-02-01', score: 735 },
      { date: '2023-03-01', score: 750 },
    ],
    factors: [
      'On-time payment history',
      'Low credit utilization',
      'Length of credit history',
    ],
  };

  beforeEach(() => {
    (useCreditScore as jest.Mock).mockReturnValue({
      creditScore: mockCreditScoreData,
      isLoading: false,
      error: null,
    });
  });

  it('renders the component', async () => {
    render(<CreditScoreOverview />);
    await waitFor(() => {
      expect(screen.getByTestId('credit-score-overview')).toBeInTheDocument();
    });
  });

  it('displays the current credit score', async () => {
    render(<CreditScoreOverview />);
    await waitFor(() => {
      expect(screen.getByText('750')).toBeInTheDocument();
    });
  });

  it('renders the credit score history chart', async () => {
    render(<CreditScoreOverview />);
    await waitFor(() => {
      expect(screen.getByTestId('credit-score-chart')).toBeInTheDocument();
    });
  });

  it('displays key factors affecting credit score', async () => {
    render(<CreditScoreOverview />);
    await waitFor(() => {
      mockCreditScoreData.factors.forEach((factor) => {
        expect(screen.getByText(factor)).toBeInTheDocument();
      });
    });
  });

  it('handles API request failures', async () => {
    (useCreditScore as jest.Mock).mockReturnValue({
      creditScore: null,
      isLoading: false,
      error: 'Failed to fetch credit score data',
    });

    render(<CreditScoreOverview />);
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch credit score data')).toBeInTheDocument();
    });
  });

  it('is accessible', async () => {
    const { container } = render(<CreditScoreOverview />);
    await waitFor(() => {
      expect(container).toBeAccessible();
    });
  });
});

// Commented list of human tasks
/*
Human tasks:
1. Implement actual API mocking using tools like Mock Service Worker (MSW) [Required]
2. Add more comprehensive test cases for different credit score ranges and their corresponding colors [Optional]
3. Implement integration tests with other related components [Optional]
*/
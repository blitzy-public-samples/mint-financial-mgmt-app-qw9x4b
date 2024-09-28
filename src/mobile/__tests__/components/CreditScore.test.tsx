import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CreditScoreGauge } from '../../src/components/CreditScore/CreditScoreGauge';
import { CreditScoreOverviewScreen } from '../../src/screens/CreditScore/CreditScoreOverviewScreen';
import { CreditScoreHistoryScreen } from '../../src/screens/CreditScore/CreditScoreHistoryScreen';
import { CreditScore } from '../../src/types/creditScore.types';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

describe('CreditScoreGauge component', () => {
  it('renders correctly with different scores', () => {
    const { getByTestId, rerender } = render(<CreditScoreGauge score={700} />);
    expect(getByTestId('credit-score-gauge')).toBeTruthy();

    rerender(<CreditScoreGauge score={550} />);
    expect(getByTestId('credit-score-gauge')).toBeTruthy();

    rerender(<CreditScoreGauge score={800} />);
    expect(getByTestId('credit-score-gauge')).toBeTruthy();
  });

  it('calculates color based on score', () => {
    const { getByTestId } = render(<CreditScoreGauge score={700} />);
    const gauge = getByTestId('credit-score-gauge');
    expect(gauge.props.color).toBe('green'); // Assuming 700 is a good score

    const { getByTestId: getByTestId2 } = render(<CreditScoreGauge score={550} />);
    const gauge2 = getByTestId2('credit-score-gauge');
    expect(gauge2.props.color).toBe('orange'); // Assuming 550 is a fair score
  });

  it('calculates arc length based on score', () => {
    const { getByTestId } = render(<CreditScoreGauge score={700} />);
    const gauge = getByTestId('credit-score-gauge');
    expect(gauge.props.arcLength).toBeCloseTo(0.7, 1); // Assuming 700 is 70% of max score
  });
});

describe('CreditScoreOverviewScreen component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<CreditScoreOverviewScreen navigation={mockNavigation as any} />);
    expect(getByText('Credit Score Overview')).toBeTruthy();
  });

  it('displays current credit score and rating', async () => {
    const { getByText } = render(<CreditScoreOverviewScreen navigation={mockNavigation as any} />);
    await waitFor(() => {
      expect(getByText(/Your current credit score/i)).toBeTruthy();
      expect(getByText(/Rating:/i)).toBeTruthy();
    });
  });

  it('displays key factors affecting credit score', async () => {
    const { getByText } = render(<CreditScoreOverviewScreen navigation={mockNavigation as any} />);
    await waitFor(() => {
      expect(getByText(/Key Factors/i)).toBeTruthy();
    });
  });

  it('navigates to credit score history screen', () => {
    const { getByText } = render(<CreditScoreOverviewScreen navigation={mockNavigation as any} />);
    fireEvent.press(getByText('View History'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('CreditScoreHistory');
  });
});

describe('CreditScoreHistoryScreen component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<CreditScoreHistoryScreen />);
    expect(getByText('Credit Score History')).toBeTruthy();
  });

  it('displays credit score history chart', async () => {
    const { getByTestId } = render(<CreditScoreHistoryScreen />);
    await waitFor(() => {
      expect(getByTestId('credit-score-history-chart')).toBeTruthy();
    });
  });

  it('handles loading state', () => {
    const { getByTestId } = render(<CreditScoreHistoryScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('handles error state', async () => {
    // Mock an error state
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { getByText } = render(<CreditScoreHistoryScreen />);
    await waitFor(() => {
      expect(getByText(/Error loading credit score history/i)).toBeTruthy();
    });
  });
});

// Implement mock data for credit score history in tests
const mockCreditScoreHistory: CreditScore[] = [
  { date: '2023-01-01', score: 700 },
  { date: '2023-02-01', score: 710 },
  { date: '2023-03-01', score: 705 },
  { date: '2023-04-01', score: 720 },
];

// Add more comprehensive tests for edge cases and error handling
describe('CreditScoreGauge edge cases', () => {
  it('handles minimum score', () => {
    const { getByTestId } = render(<CreditScoreGauge score={300} />);
    const gauge = getByTestId('credit-score-gauge');
    expect(gauge.props.color).toBe('red');
    expect(gauge.props.arcLength).toBeCloseTo(0, 1);
  });

  it('handles maximum score', () => {
    const { getByTestId } = render(<CreditScoreGauge score={850} />);
    const gauge = getByTestId('credit-score-gauge');
    expect(gauge.props.color).toBe('green');
    expect(gauge.props.arcLength).toBeCloseTo(1, 1);
  });

  it('handles invalid scores', () => {
    const { getByText } = render(<CreditScoreGauge score={-100} />);
    expect(getByText('Invalid Score')).toBeTruthy();

    const { getByText: getByText2 } = render(<CreditScoreGauge score={1000} />);
    expect(getByText2('Invalid Score')).toBeTruthy();
  });
});

// TODO: Implement integration tests with mocked API calls
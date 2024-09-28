import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import InvestmentOverview from '../../components/Investments/InvestmentOverview';
import { useInvestments } from '../../hooks/useInvestments';

// Mock the useInvestments hook
jest.mock('../../hooks/useInvestments');

describe('InvestmentOverview', () => {
  const mockInvestmentData = {
    totalValue: 100000,
    performancePercentage: 5.5,
    assetAllocation: [
      { name: 'Stocks', value: 60000 },
      { name: 'Bonds', value: 30000 },
      { name: 'Cash', value: 10000 },
    ],
    topPerformingInvestments: [
      { name: 'AAPL', value: 15000, performance: 10.2 },
      { name: 'GOOGL', value: 12000, performance: 8.7 },
      { name: 'MSFT', value: 10000, performance: 7.5 },
    ],
  };

  beforeEach(() => {
    (useInvestments as jest.Mock).mockReturnValue({
      investmentData: mockInvestmentData,
      isLoading: false,
      error: null,
    });
  });

  it('renders without crashing', () => {
    render(<InvestmentOverview />);
    expect(screen.getByTestId('investment-overview')).toBeInTheDocument();
  });

  it('displays the correct total portfolio value', () => {
    render(<InvestmentOverview />);
    expect(screen.getByText('$100,000')).toBeInTheDocument();
  });

  it('calculates and displays the correct performance percentage', () => {
    render(<InvestmentOverview />);
    expect(screen.getByText('5.5%')).toBeInTheDocument();
  });

  it('renders the asset allocation chart', () => {
    render(<InvestmentOverview />);
    expect(screen.getByTestId('asset-allocation-chart')).toBeInTheDocument();
  });

  it('displays the top-performing investments', () => {
    render(<InvestmentOverview />);
    mockInvestmentData.topPerformingInvestments.forEach((investment) => {
      expect(screen.getByText(investment.name)).toBeInTheDocument();
      expect(screen.getByText(`$${investment.value.toLocaleString()}`)).toBeInTheDocument();
      expect(screen.getByText(`${investment.performance}%`)).toBeInTheDocument();
    });
  });

  it('handles loading state correctly', () => {
    (useInvestments as jest.Mock).mockReturnValue({
      investmentData: null,
      isLoading: true,
      error: null,
    });
    render(<InvestmentOverview />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('handles error state correctly', () => {
    const errorMessage = 'Failed to fetch investment data';
    (useInvestments as jest.Mock).mockReturnValue({
      investmentData: null,
      isLoading: false,
      error: new Error(errorMessage),
    });
    render(<InvestmentOverview />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});

// Human tasks:
// TODO: Implement tests for edge cases and boundary conditions
// TODO: Add integration tests with other related components
// TODO: Implement snapshot tests for the InvestmentOverview component
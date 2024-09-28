import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { InvestmentsOverviewScreen } from '../../src/screens/Investments/InvestmentsOverviewScreen';
import { InvestmentDetailsScreen } from '../../src/screens/Investments/InvestmentDetailsScreen';
import { InvestmentSummaryCard } from '../../src/components/Investments/InvestmentSummaryCard';
import { investmentService } from '../../src/services/investment.service';
import investmentSlice from '../../src/store/slices/investmentSlice';

jest.mock('../../src/services/investment.service');

const setupStore = () => {
  return configureStore({
    reducer: {
      investment: investmentSlice,
    },
  });
};

describe('InvestmentsOverviewScreen component', () => {
  it('renders correctly with investment data', async () => {
    const store = setupStore();
    const mockInvestments = [
      { id: '1', name: 'Stock A', value: 1000, performance: 5.5 },
      { id: '2', name: 'Bond B', value: 2000, performance: -1.2 },
    ];

    jest.spyOn(investmentService, 'getInvestments').mockResolvedValue(mockInvestments);

    const { getByText, getAllByTestId } = render(
      <Provider store={store}>
        <InvestmentsOverviewScreen />
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('Total Portfolio Value: $3,000')).toBeTruthy();
      expect(getByText('Overall Performance: +2.15%')).toBeTruthy();
      expect(getAllByTestId('investment-summary-card')).toHaveLength(2);
    });
  });

  it('handles refresh action', async () => {
    const store = setupStore();
    const mockRefresh = jest.fn();
    jest.spyOn(investmentService, 'getInvestments').mockImplementation(mockRefresh);

    const { getByTestId } = render(
      <Provider store={store}>
        <InvestmentsOverviewScreen />
      </Provider>
    );

    const refreshControl = getByTestId('refresh-control');
    fireEvent(refreshControl, 'refresh');

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});

describe('InvestmentDetailsScreen component', () => {
  it('renders correctly with investment details', async () => {
    const store = setupStore();
    const mockInvestment = {
      id: '1',
      name: 'Stock A',
      value: 1000,
      performance: 5.5,
      history: [
        { date: '2023-01-01', value: 950 },
        { date: '2023-01-02', value: 1000 },
      ],
    };

    jest.spyOn(investmentService, 'getInvestmentDetails').mockResolvedValue(mockInvestment);

    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <InvestmentDetailsScreen route={{ params: { id: '1' } }} />
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('Stock A')).toBeTruthy();
      expect(getByText('Current Value: $1,000')).toBeTruthy();
      expect(getByText('Performance: +5.5%')).toBeTruthy();
      expect(getByTestId('investment-chart')).toBeTruthy();
    });
  });

  it('handles error state', async () => {
    const store = setupStore();
    jest.spyOn(investmentService, 'getInvestmentDetails').mockRejectedValue(new Error('Failed to fetch'));

    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <InvestmentDetailsScreen route={{ params: { id: '1' } }} />
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('Error: Failed to fetch investment details')).toBeTruthy();
      expect(getByTestId('retry-button')).toBeTruthy();
    });
  });
});

describe('InvestmentSummaryCard component', () => {
  it('renders correctly with provided props', () => {
    const investment = {
      id: '1',
      name: 'Stock A',
      value: 1000,
      performance: 5.5,
    };

    const { getByText, getByTestId } = render(<InvestmentSummaryCard investment={investment} />);

    expect(getByText('Stock A')).toBeTruthy();
    expect(getByText('$1,000')).toBeTruthy();
    expect(getByText('+5.5%')).toBeTruthy();
    expect(getByTestId('performance-indicator')).toHaveStyle({ color: 'green' });
  });
});

describe('investmentSlice', () => {
  it('handles fetchInvestmentPortfolio action', async () => {
    const store = setupStore();
    const mockInvestments = [
      { id: '1', name: 'Stock A', value: 1000, performance: 5.5 },
      { id: '2', name: 'Bond B', value: 2000, performance: -1.2 },
    ];

    jest.spyOn(investmentService, 'getInvestments').mockResolvedValue(mockInvestments);

    await store.dispatch(investmentSlice.actions.fetchInvestmentPortfolio());

    const state = store.getState().investment;
    expect(state.loading).toBe(false);
    expect(state.investments).toEqual(mockInvestments);
    expect(state.totalValue).toBe(3000);
  });

  it('handles addInvestment action', () => {
    const store = setupStore();
    const newInvestment = { id: '3', name: 'ETF C', value: 1500, performance: 2.3 };

    store.dispatch(investmentSlice.actions.addInvestment(newInvestment));

    const state = store.getState().investment;
    expect(state.investments).toContainEqual(newInvestment);
    expect(state.totalValue).toBe(1500);
  });

  it('handles updateInvestment action', () => {
    const store = setupStore();
    const initialInvestment = { id: '1', name: 'Stock A', value: 1000, performance: 5.5 };
    store.dispatch(investmentSlice.actions.addInvestment(initialInvestment));

    const updatedInvestment = { ...initialInvestment, value: 1100, performance: 6.0 };
    store.dispatch(investmentSlice.actions.updateInvestment(updatedInvestment));

    const state = store.getState().investment;
    expect(state.investments).toContainEqual(updatedInvestment);
    expect(state.totalValue).toBe(1100);
  });

  it('handles deleteInvestment action', () => {
    const store = setupStore();
    const investment = { id: '1', name: 'Stock A', value: 1000, performance: 5.5 };
    store.dispatch(investmentSlice.actions.addInvestment(investment));

    store.dispatch(investmentSlice.actions.deleteInvestment('1'));

    const state = store.getState().investment;
    expect(state.investments).not.toContainEqual(investment);
    expect(state.totalValue).toBe(0);
  });
});

// Human tasks (commented)
/*
TODO: Implement integration tests for the investment components with the Redux store
TODO: Add snapshot tests for the InvestmentSummaryCard component
TODO: Create mock data for different investment scenarios (e.g., high-risk, low-risk portfolios)
TODO: Implement tests for error handling and edge cases in all components
TODO: Add performance tests for rendering large lists of investments
*/
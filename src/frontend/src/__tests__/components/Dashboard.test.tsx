import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockProvider } from '../../test-utils/MockProvider';
import Dashboard from '../../components/Dashboard/Dashboard';
import NetWorth from '../../components/Dashboard/NetWorth';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import SpendingByCategory from '../../components/Dashboard/SpendingByCategory';
import FinancialInsights from '../../components/Dashboard/FinancialInsights';

// Mock the child components
jest.mock('../../components/Dashboard/NetWorth');
jest.mock('../../components/Dashboard/RecentTransactions');
jest.mock('../../components/Dashboard/SpendingByCategory');
jest.mock('../../components/Dashboard/FinancialInsights');

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
  });

  it('renders all dashboard widgets', async () => {
    render(
      <MockProvider>
        <Dashboard />
      </MockProvider>
    );

    await waitFor(() => {
      expect(NetWorth).toHaveBeenCalled();
      expect(RecentTransactions).toHaveBeenCalled();
      expect(SpendingByCategory).toHaveBeenCalled();
      expect(FinancialInsights).toHaveBeenCalled();
    });
  });

  it('displays loading state while fetching data', async () => {
    render(
      <MockProvider>
        <Dashboard />
      </MockProvider>
    );

    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('dashboard-loading')).not.toBeInTheDocument();
    });
  });

  it('handles errors when fetching dashboard data', async () => {
    // Mock an API error
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));

    render(
      <MockProvider>
        <Dashboard />
      </MockProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error loading dashboard data/i)).toBeInTheDocument();
    });
  });

  it('allows refreshing dashboard data', async () => {
    const user = userEvent.setup();
    render(
      <MockProvider>
        <Dashboard />
      </MockProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/refresh/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/refresh/i));

    // Check if the refresh function is called
    // This assumes that there's a function called when the refresh button is clicked
    // You might need to adjust this based on your actual implementation
    await waitFor(() => {
      expect(NetWorth).toHaveBeenCalledTimes(2);
      expect(RecentTransactions).toHaveBeenCalledTimes(2);
      expect(SpendingByCategory).toHaveBeenCalledTimes(2);
      expect(FinancialInsights).toHaveBeenCalledTimes(2);
    });
  });
});

// Commented list of human tasks
/*
Human tasks:
1. Implement mock data and API responses for dashboard tests (Required)
2. Create comprehensive test cases covering all dashboard functionalities (Required)
3. Set up test environment with necessary providers and mocks (Required)
*/
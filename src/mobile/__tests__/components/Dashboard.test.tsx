import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { jest } from '@jest/globals';
import DashboardScreen from '../../src/screens/Dashboard/DashboardScreen';
import NetWorthWidget from '../../src/components/Dashboard/NetWorthWidget';
import RecentTransactionsWidget from '../../src/components/Dashboard/RecentTransactionsWidget';
import SpendingByCategoryWidget from '../../src/components/Dashboard/SpendingByCategoryWidget';
import FinancialInsightsWidget from '../../src/components/Dashboard/FinancialInsightsWidget';

// Mock navigation
const mockNavigation = jest.fn();

// Mock useAuth hook
const mockUseAuth = jest.fn();

// Mock the components
jest.mock('../../src/components/Dashboard/NetWorthWidget', () => 'NetWorthWidget');
jest.mock('../../src/components/Dashboard/RecentTransactionsWidget', () => 'RecentTransactionsWidget');
jest.mock('../../src/components/Dashboard/SpendingByCategoryWidget', () => 'SpendingByCategoryWidget');
jest.mock('../../src/components/Dashboard/FinancialInsightsWidget', () => 'FinancialInsightsWidget');

describe('DashboardScreen', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockNavigation.mockClear();
    mockUseAuth.mockClear();
  });

  it('renders all widgets', () => {
    const { getByTestId } = render(<DashboardScreen navigation={mockNavigation} />);

    expect(getByTestId('net-worth-widget')).toBeTruthy();
    expect(getByTestId('recent-transactions-widget')).toBeTruthy();
    expect(getByTestId('spending-by-category-widget')).toBeTruthy();
    expect(getByTestId('financial-insights-widget')).toBeTruthy();
  });

  it('handles pull-to-refresh', async () => {
    const { getByTestId } = render(<DashboardScreen navigation={mockNavigation} />);
    const scrollView = getByTestId('dashboard-scroll-view');

    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { y: -100 },
        contentSize: { height: 1000, width: 100 },
        layoutMeasurement: { height: 100, width: 100 },
      },
    });

    await waitFor(() => {
      // Check if refresh function is called
      // This will depend on how you implement the refresh functionality
      // For example, you might want to check if certain data fetching functions are called
      expect(mockUseAuth).toHaveBeenCalled();
    });
  });

  it('navigates to other screens when widgets are tapped', () => {
    const { getByTestId } = render(<DashboardScreen navigation={mockNavigation} />);

    fireEvent.press(getByTestId('net-worth-widget'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('NetWorthDetails');

    fireEvent.press(getByTestId('recent-transactions-widget'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('TransactionsList');

    fireEvent.press(getByTestId('spending-by-category-widget'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('SpendingCategories');

    fireEvent.press(getByTestId('financial-insights-widget'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('FinancialInsights');
  });
});

// TODO: Implement tests for error handling scenarios in child components
// TODO: Add tests for loading indicators in each widget
// TODO: Create mock data for each widget to test various financial scenarios
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AccountsListScreen } from '../../src/screens/Accounts/AccountsListScreen';
import { AccountListItem } from '../../src/components/Accounts/AccountListItem';
import { useAccounts } from '../../src/hooks/useAccounts';

// Mock the useAccounts hook
jest.mock('../../src/hooks/useAccounts');

describe('AccountsListScreen', () => {
  const mockAccounts = [
    { id: '1', name: 'Checking Account', balance: 1000 },
    { id: '2', name: 'Savings Account', balance: 5000 },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();

    // Mock the useAccounts hook to return our test data
    (useAccounts as jest.Mock).mockReturnValue({
      accounts: mockAccounts,
      isLoading: false,
      error: null,
    });
  });

  it('renders the accounts list correctly', async () => {
    const { getByText, getAllByTestId } = render(<AccountsListScreen />);

    // Wait for the component to finish rendering
    await waitFor(() => {
      expect(getByText('Accounts')).toBeTruthy();
    });

    // Check if all accounts are rendered
    const accountItems = getAllByTestId('account-list-item');
    expect(accountItems).toHaveLength(mockAccounts.length);

    // Check if account names are displayed
    expect(getByText('Checking Account')).toBeTruthy();
    expect(getByText('Savings Account')).toBeTruthy();
  });

  it('displays loading state when fetching accounts', () => {
    (useAccounts as jest.Mock).mockReturnValue({
      accounts: [],
      isLoading: true,
      error: null,
    });

    const { getByTestId } = render(<AccountsListScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('displays error message when fetching accounts fails', () => {
    const errorMessage = 'Failed to fetch accounts';
    (useAccounts as jest.Mock).mockReturnValue({
      accounts: [],
      isLoading: false,
      error: new Error(errorMessage),
    });

    const { getByText } = render(<AccountsListScreen />);
    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('navigates to account details when an account is pressed', () => {
    const mockNavigation = { navigate: jest.fn() };
    const { getAllByTestId } = render(<AccountsListScreen navigation={mockNavigation} />);

    const accountItems = getAllByTestId('account-list-item');
    fireEvent.press(accountItems[0]);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AccountDetails', { accountId: '1' });
  });
});

describe('AccountListItem', () => {
  const mockAccount = { id: '1', name: 'Test Account', balance: 1000 };

  it('renders account information correctly', () => {
    const { getByText, getByTestId } = render(<AccountListItem account={mockAccount} />);

    expect(getByText('Test Account')).toBeTruthy();
    expect(getByText('$1,000.00')).toBeTruthy();
    expect(getByTestId('account-icon')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<AccountListItem account={mockAccount} onPress={mockOnPress} />);

    fireEvent.press(getByTestId('account-list-item'));
    expect(mockOnPress).toHaveBeenCalledWith(mockAccount.id);
  });
});

// Commented list of human tasks
/*
Human tasks:
1. Implement comprehensive test cases covering all possible scenarios for AccountsListScreen (Required)
2. Add integration tests to check the interaction between AccountsListScreen and its child components (Required)
3. Implement mock data and functions for useAccounts hook and navigation (Required)
*/
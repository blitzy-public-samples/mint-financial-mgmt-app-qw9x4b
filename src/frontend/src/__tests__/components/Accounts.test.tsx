import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AccountsList } from '../../components/Accounts/AccountsList';
import { useAccounts } from '../../hooks/useAccounts';

// Mock the useAccounts hook
jest.mock('../../hooks/useAccounts');

describe('AccountsList', () => {
  // Mock data for testing
  const mockAccounts = [
    { id: '1', name: 'Checking Account', balance: 1000 },
    { id: '2', name: 'Savings Account', balance: 5000 },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
  });

  it('renders the accounts list correctly', async () => {
    // Mock the useAccounts hook to return our test data
    (useAccounts as jest.Mock).mockReturnValue({
      accounts: mockAccounts,
      isLoading: false,
      error: null,
    });

    render(<AccountsList />);

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText('Checking Account')).toBeInTheDocument();
      expect(screen.getByText('Savings Account')).toBeInTheDocument();
    });

    // Check if the balances are displayed
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
  });

  it('displays a loading state', () => {
    (useAccounts as jest.Mock).mockReturnValue({
      accounts: [],
      isLoading: true,
      error: null,
    });

    render(<AccountsList />);

    expect(screen.getByText('Loading accounts...')).toBeInTheDocument();
  });

  it('displays an error message when loading fails', () => {
    const errorMessage = 'Failed to load accounts';
    (useAccounts as jest.Mock).mockReturnValue({
      accounts: [],
      isLoading: false,
      error: new Error(errorMessage),
    });

    render(<AccountsList />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('allows adding a new account', async () => {
    const mockAddAccount = jest.fn();
    (useAccounts as jest.Mock).mockReturnValue({
      accounts: mockAccounts,
      isLoading: false,
      error: null,
      addAccount: mockAddAccount,
    });

    render(<AccountsList />);

    // Click the "Add Account" button
    fireEvent.click(screen.getByText('Add Account'));

    // Fill in the new account form (assuming there's a modal or form that appears)
    fireEvent.change(screen.getByLabelText('Account Name'), { target: { value: 'New Account' } });
    fireEvent.change(screen.getByLabelText('Initial Balance'), { target: { value: '1000' } });
    fireEvent.click(screen.getByText('Save'));

    // Check if the addAccount function was called with the correct arguments
    await waitFor(() => {
      expect(mockAddAccount).toHaveBeenCalledWith({
        name: 'New Account',
        balance: 1000,
      });
    });
  });

  // Add more test cases here as needed
});

// Commented list of human tasks
/*
Human tasks:
1. Add more comprehensive test cases for error handling scenarios (Required)
2. Implement integration tests with actual API calls (mocked) (Optional)
*/
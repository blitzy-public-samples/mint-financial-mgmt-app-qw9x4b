import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import configureStore from '@reduxjs/toolkit';

import TransactionsListScreen from '../../src/screens/Transactions/TransactionsListScreen';
import TransactionDetailsScreen from '../../src/screens/Transactions/TransactionDetailsScreen';
import { transactionService } from '../../src/services/transaction.service';
import { useTransactions } from '../../src/hooks/useTransactions';

// Mock the navigation
const Stack = createStackNavigator();
const MockedNavigator = ({ component, params = {} }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="MockedScreen" component={component} initialParams={params} />
    </Stack.Navigator>
  </NavigationContainer>
);

// Mock the Redux store
const mockStore = configureStore({
  reducer: {
    transactions: (state = { transactions: [] }, action) => state,
  },
});

// Mock the transaction service
jest.mock('../../src/services/transaction.service');

// Mock the useTransactions hook
jest.mock('../../src/hooks/useTransactions');

describe('TransactionsListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <MockedNavigator component={TransactionsListScreen} />
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('Transactions')).toBeTruthy();
    });
  });

  it('fetches and displays transactions', async () => {
    const mockTransactions = [
      { id: '1', description: 'Transaction 1', amount: 100 },
      { id: '2', description: 'Transaction 2', amount: -50 },
    ];

    (useTransactions as jest.Mock).mockReturnValue({
      transactions: mockTransactions,
      isLoading: false,
      error: null,
    });

    const { getByText } = render(
      <Provider store={mockStore}>
        <MockedNavigator component={TransactionsListScreen} />
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('Transaction 1')).toBeTruthy();
      expect(getByText('Transaction 2')).toBeTruthy();
    });
  });

  it('handles search functionality', async () => {
    const mockTransactions = [
      { id: '1', description: 'Grocery Shopping', amount: 100 },
      { id: '2', description: 'Restaurant', amount: -50 },
    ];

    (useTransactions as jest.Mock).mockReturnValue({
      transactions: mockTransactions,
      isLoading: false,
      error: null,
    });

    const { getByPlaceholderText, getByText, queryByText } = render(
      <Provider store={mockStore}>
        <MockedNavigator component={TransactionsListScreen} />
      </Provider>
    );

    const searchInput = getByPlaceholderText('Search transactions');
    fireEvent.changeText(searchInput, 'Grocery');

    await waitFor(() => {
      expect(getByText('Grocery Shopping')).toBeTruthy();
      expect(queryByText('Restaurant')).toBeNull();
    });
  });

  it('navigates to transaction details', async () => {
    const mockTransactions = [
      { id: '1', description: 'Transaction 1', amount: 100 },
    ];

    (useTransactions as jest.Mock).mockReturnValue({
      transactions: mockTransactions,
      isLoading: false,
      error: null,
    });

    const mockNavigation = { navigate: jest.fn() };

    const { getByText } = render(
      <Provider store={mockStore}>
        <MockedNavigator component={TransactionsListScreen} />
      </Provider>
    );

    await waitFor(() => {
      fireEvent.press(getByText('Transaction 1'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('TransactionDetails', { transactionId: '1' });
    });
  });
});

describe('TransactionDetailsScreen', () => {
  const mockTransaction = {
    id: '1',
    description: 'Test Transaction',
    amount: 100,
    date: '2023-05-01',
    category: 'Food',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (transactionService.getTransactionById as jest.Mock).mockResolvedValue(mockTransaction);
  });

  it('renders correctly with transaction details', async () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <MockedNavigator
          component={TransactionDetailsScreen}
          params={{ transactionId: '1' }}
        />
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('Test Transaction')).toBeTruthy();
      expect(getByText('$100')).toBeTruthy();
      expect(getByText('2023-05-01')).toBeTruthy();
      expect(getByText('Food')).toBeTruthy();
    });
  });

  it('allows editing transaction fields', async () => {
    const { getByText, getByDisplayValue } = render(
      <Provider store={mockStore}>
        <MockedNavigator
          component={TransactionDetailsScreen}
          params={{ transactionId: '1' }}
        />
      </Provider>
    );

    await waitFor(() => {
      const descriptionInput = getByDisplayValue('Test Transaction');
      fireEvent.changeText(descriptionInput, 'Updated Transaction');
      expect(getByDisplayValue('Updated Transaction')).toBeTruthy();
    });
  });

  it('saves updated transaction details', async () => {
    (transactionService.updateTransaction as jest.Mock).mockResolvedValue({ ...mockTransaction, description: 'Updated Transaction' });

    const { getByText, getByDisplayValue } = render(
      <Provider store={mockStore}>
        <MockedNavigator
          component={TransactionDetailsScreen}
          params={{ transactionId: '1' }}
        />
      </Provider>
    );

    await waitFor(() => {
      const descriptionInput = getByDisplayValue('Test Transaction');
      fireEvent.changeText(descriptionInput, 'Updated Transaction');
      fireEvent.press(getByText('Save'));
    });

    expect(transactionService.updateTransaction).toHaveBeenCalledWith({
      ...mockTransaction,
      description: 'Updated Transaction',
    });
  });

  it('handles error when saving fails', async () => {
    (transactionService.updateTransaction as jest.Mock).mockRejectedValue(new Error('Update failed'));

    const { getByText, getByDisplayValue } = render(
      <Provider store={mockStore}>
        <MockedNavigator
          component={TransactionDetailsScreen}
          params={{ transactionId: '1' }}
        />
      </Provider>
    );

    await waitFor(() => {
      const descriptionInput = getByDisplayValue('Test Transaction');
      fireEvent.changeText(descriptionInput, 'Updated Transaction');
      fireEvent.press(getByText('Save'));
    });

    await waitFor(() => {
      expect(getByText('Error: Update failed')).toBeTruthy();
    });
  });
});

// Helper function to set up the test environment for components
function setupTestComponent(Component: React.ComponentType, props: object = {}) {
  const mockStore = configureStore({
    reducer: {
      transactions: (state = { transactions: [] }, action) => state,
    },
  });

  return render(
    <Provider store={mockStore}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="TestScreen" component={Component} initialParams={props} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
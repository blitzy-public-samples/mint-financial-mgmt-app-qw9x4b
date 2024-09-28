import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionList } from '../../components/Transactions/TransactionList';
import { useTransactions } from '../../hooks/useTransactions';

// Mock the useTransactions hook
jest.mock('../../hooks/useTransactions');

// Mock implementation of useTransactions
const mockUseTransactions = useTransactions as jest.MockedFunction<typeof useTransactions>;

describe('TransactionList component', () => {
  const mockTransactions = [
    { id: '1', date: new Date('2023-05-01'), description: 'Grocery shopping', amount: 50.00, category: 'Food' },
    { id: '2', date: new Date('2023-05-02'), description: 'Gas station', amount: 30.00, category: 'Transportation' },
    { id: '3', date: new Date('2023-05-03'), description: 'Movie tickets', amount: 25.00, category: 'Entertainment' },
  ];

  beforeEach(() => {
    mockUseTransactions.mockReset();
  });

  it('renders loading state', async () => {
    mockUseTransactions.mockReturnValue({ transactions: [], isLoading: true, error: null });
    render(<TransactionList />);
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('renders empty state', async () => {
    mockUseTransactions.mockReturnValue({ transactions: [], isLoading: false, error: null });
    render(<TransactionList />);
    expect(screen.getByText('No transactions')).toBeInTheDocument();
  });

  it('renders transactions correctly', async () => {
    mockUseTransactions.mockReturnValue({ transactions: mockTransactions, isLoading: false, error: null });
    render(<TransactionList />);
    
    await waitFor(() => {
      expect(screen.getByText('Grocery shopping')).toBeInTheDocument();
      expect(screen.getByText('Gas station')).toBeInTheDocument();
      expect(screen.getByText('Movie tickets')).toBeInTheDocument();
    });

    expect(screen.getAllByTestId('transaction-item')).toHaveLength(3);
  });

  it('sorts transactions', async () => {
    mockUseTransactions.mockReturnValue({ transactions: mockTransactions, isLoading: false, error: null });
    render(<TransactionList />);

    const sortButton = screen.getByText('Sort by Date');
    userEvent.click(sortButton);

    await waitFor(() => {
      const transactionItems = screen.getAllByTestId('transaction-item');
      expect(transactionItems[0]).toHaveTextContent('Movie tickets');
      expect(transactionItems[2]).toHaveTextContent('Grocery shopping');
    });
  });

  it('filters transactions', async () => {
    mockUseTransactions.mockReturnValue({ transactions: mockTransactions, isLoading: false, error: null });
    render(<TransactionList />);

    const filterInput = screen.getByPlaceholderText('Filter transactions');
    userEvent.type(filterInput, 'Gas');

    await waitFor(() => {
      const transactionItems = screen.getAllByTestId('transaction-item');
      expect(transactionItems).toHaveLength(1);
      expect(transactionItems[0]).toHaveTextContent('Gas station');
    });
  });
});

// Human tasks:
// TODO: Implement additional test cases for edge scenarios
// TODO: Add integration tests with actual API calls (if applicable)
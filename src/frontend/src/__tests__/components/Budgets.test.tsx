import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { BudgetOverview } from '../../components/Budgets/BudgetOverview';
import { useBudgets } from '../../hooks/useBudgets';

// Mock the useBudgets hook
jest.mock('../../hooks/useBudgets');

const mockBudgets = [
  { id: '1', category: 'Food', amount: 500, spent: 300 },
  { id: '2', category: 'Transportation', amount: 200, spent: 150 },
  { id: '3', category: 'Entertainment', amount: 100, spent: 80 },
];

describe('BudgetOverview Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
  });

  it('renders the BudgetOverview component without crashing', () => {
    (useBudgets as jest.Mock).mockReturnValue({ budgets: [], isLoading: false, error: null });
    render(<BudgetOverview />);
    expect(screen.getByText(/Budget Overview/i)).toBeInTheDocument();
  });

  it('displays the correct total budget and spending', async () => {
    (useBudgets as jest.Mock).mockReturnValue({ budgets: mockBudgets, isLoading: false, error: null });
    render(<BudgetOverview />);
    
    await waitFor(() => {
      expect(screen.getByText(/Total Budget: \$800/)).toBeInTheDocument();
      expect(screen.getByText(/Total Spent: \$530/)).toBeInTheDocument();
    });
  });

  it('renders the correct number of budget category cards', async () => {
    (useBudgets as jest.Mock).mockReturnValue({ budgets: mockBudgets, isLoading: false, error: null });
    render(<BudgetOverview />);
    
    await waitFor(() => {
      const categoryCards = screen.getAllByTestId('budget-category-card');
      expect(categoryCards).toHaveLength(3);
    });
  });

  it('navigates to the create budget page when the "Create Budget" button is clicked', async () => {
    const mockNavigate = jest.fn();
    (useBudgets as jest.Mock).mockReturnValue({ budgets: [], isLoading: false, error: null });
    render(<BudgetOverview navigate={mockNavigate} />);
    
    const createBudgetButton = screen.getByText(/Create Budget/i);
    userEvent.click(createBudgetButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/budgets/create');
    });
  });

  it('displays loading state while fetching budget data', () => {
    (useBudgets as jest.Mock).mockReturnValue({ budgets: [], isLoading: true, error: null });
    render(<BudgetOverview />);
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('displays an error message when budget data fetching fails', async () => {
    (useBudgets as jest.Mock).mockReturnValue({ budgets: [], isLoading: false, error: 'Failed to fetch budgets' });
    render(<BudgetOverview />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch budgets/)).toBeInTheDocument();
    });
  });
});

// Commented list of human tasks
/*
Human tasks:
1. Implement integration tests with a mocked API (Required)
2. Add snapshot tests for the BudgetOverview component (Optional)
3. Implement tests for edge cases and error handling (Required)
*/
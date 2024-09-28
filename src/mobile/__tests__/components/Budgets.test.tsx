import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { jest } from '@jest/globals';

// Mock the components and hooks
jest.mock('../../src/screens/Budgets/BudgetsOverviewScreen', () => 'BudgetsOverviewScreen');
jest.mock('../../src/screens/Budgets/BudgetDetailsScreen', () => 'BudgetDetailsScreen');
jest.mock('../../src/screens/Budgets/CreateBudgetScreen', () => 'CreateBudgetScreen');
jest.mock('../../src/components/Budgets/BudgetProgressBar', () => 'BudgetProgressBar');
jest.mock('../../src/hooks/useBudgets', () => ({
  useBudgets: jest.fn(),
}));

// Import the components (these would normally be at the top of the file)
import BudgetsOverviewScreen from '../../src/screens/Budgets/BudgetsOverviewScreen';
import BudgetDetailsScreen from '../../src/screens/Budgets/BudgetDetailsScreen';
import CreateBudgetScreen from '../../src/screens/Budgets/CreateBudgetScreen';
import BudgetProgressBar from '../../src/components/Budgets/BudgetProgressBar';
import { useBudgets } from '../../src/hooks/useBudgets';

describe('BudgetsOverviewScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<BudgetsOverviewScreen />);
    expect(getByText('BudgetsOverviewScreen')).toBeTruthy();
  });

  it('navigates to CreateBudgetScreen', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<BudgetsOverviewScreen navigation={navigation} />);
    fireEvent.press(getByText('Create Budget'));
    expect(navigation.navigate).toHaveBeenCalledWith('CreateBudget');
  });

  it('renders budget items', async () => {
    (useBudgets as jest.Mock).mockReturnValue({
      budgets: [
        { id: '1', name: 'Groceries', amount: 300, spent: 150 },
        { id: '2', name: 'Entertainment', amount: 200, spent: 100 },
      ],
    });

    const { getByText } = render(<BudgetsOverviewScreen />);
    await waitFor(() => {
      expect(getByText('Groceries')).toBeTruthy();
      expect(getByText('Entertainment')).toBeTruthy();
    });
  });

  it('navigates to BudgetDetailsScreen when a budget item is pressed', () => {
    const navigation = { navigate: jest.fn() };
    (useBudgets as jest.Mock).mockReturnValue({
      budgets: [{ id: '1', name: 'Groceries', amount: 300, spent: 150 }],
    });

    const { getByText } = render(<BudgetsOverviewScreen navigation={navigation} />);
    fireEvent.press(getByText('Groceries'));
    expect(navigation.navigate).toHaveBeenCalledWith('BudgetDetails', { budgetId: '1' });
  });
});

describe('BudgetDetailsScreen', () => {
  it('renders correctly', () => {
    const route = { params: { budgetId: '1' } };
    const { getByText } = render(<BudgetDetailsScreen route={route} />);
    expect(getByText('BudgetDetailsScreen')).toBeTruthy();
  });

  it('displays correct budget details', async () => {
    const route = { params: { budgetId: '1' } };
    (useBudgets as jest.Mock).mockReturnValue({
      getBudgetById: jest.fn().mockReturnValue({ id: '1', name: 'Groceries', amount: 300, spent: 150 }),
    });

    const { getByText } = render(<BudgetDetailsScreen route={route} />);
    await waitFor(() => {
      expect(getByText('Groceries')).toBeTruthy();
      expect(getByText('$300')).toBeTruthy();
      expect(getByText('$150')).toBeTruthy();
    });
  });

  it('handles edit budget functionality', () => {
    const route = { params: { budgetId: '1' } };
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<BudgetDetailsScreen route={route} navigation={navigation} />);
    fireEvent.press(getByText('Edit Budget'));
    expect(navigation.navigate).toHaveBeenCalledWith('EditBudget', { budgetId: '1' });
  });

  it('handles delete budget functionality', async () => {
    const route = { params: { budgetId: '1' } };
    const deleteBudget = jest.fn();
    (useBudgets as jest.Mock).mockReturnValue({ deleteBudget });

    const { getByText } = render(<BudgetDetailsScreen route={route} />);
    fireEvent.press(getByText('Delete Budget'));
    await waitFor(() => {
      expect(deleteBudget).toHaveBeenCalledWith('1');
    });
  });
});

describe('CreateBudgetScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<CreateBudgetScreen />);
    expect(getByText('CreateBudgetScreen')).toBeTruthy();
  });

  it('handles input validation', async () => {
    const { getByPlaceholderText, getByText } = render(<CreateBudgetScreen />);
    const nameInput = getByPlaceholderText('Budget Name');
    const amountInput = getByPlaceholderText('Budget Amount');

    fireEvent.changeText(nameInput, '');
    fireEvent.changeText(amountInput, '-100');
    fireEvent.press(getByText('Create Budget'));

    await waitFor(() => {
      expect(getByText('Name is required')).toBeTruthy();
      expect(getByText('Amount must be positive')).toBeTruthy();
    });
  });

  it('handles budget creation functionality', async () => {
    const createBudget = jest.fn();
    (useBudgets as jest.Mock).mockReturnValue({ createBudget });

    const { getByPlaceholderText, getByText } = render(<CreateBudgetScreen />);
    const nameInput = getByPlaceholderText('Budget Name');
    const amountInput = getByPlaceholderText('Budget Amount');

    fireEvent.changeText(nameInput, 'Groceries');
    fireEvent.changeText(amountInput, '300');
    fireEvent.press(getByText('Create Budget'));

    await waitFor(() => {
      expect(createBudget).toHaveBeenCalledWith({ name: 'Groceries', amount: 300 });
    });
  });

  it('navigates after successful budget creation', async () => {
    const navigation = { navigate: jest.fn() };
    const createBudget = jest.fn().mockResolvedValue({ id: '1' });
    (useBudgets as jest.Mock).mockReturnValue({ createBudget });

    const { getByPlaceholderText, getByText } = render(<CreateBudgetScreen navigation={navigation} />);
    const nameInput = getByPlaceholderText('Budget Name');
    const amountInput = getByPlaceholderText('Budget Amount');

    fireEvent.changeText(nameInput, 'Groceries');
    fireEvent.changeText(amountInput, '300');
    fireEvent.press(getByText('Create Budget'));

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('BudgetDetails', { budgetId: '1' });
    });
  });
});

describe('BudgetProgressBar', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<BudgetProgressBar spent={50} total={100} />);
    expect(getByTestId('budget-progress-bar')).toBeTruthy();
  });

  it('calculates progress correctly', () => {
    const { getByTestId } = render(<BudgetProgressBar spent={75} total={100} />);
    const progressBar = getByTestId('budget-progress-bar');
    expect(progressBar.props.progress).toBe(0.75);
  });

  it('changes color based on progress', () => {
    const { getByTestId, rerender } = render(<BudgetProgressBar spent={25} total={100} />);
    let progressBar = getByTestId('budget-progress-bar');
    expect(progressBar.props.color).toBe('green');

    rerender(<BudgetProgressBar spent={80} total={100} />);
    progressBar = getByTestId('budget-progress-bar');
    expect(progressBar.props.color).toBe('orange');

    rerender(<BudgetProgressBar spent={110} total={100} />);
    progressBar = getByTestId('budget-progress-bar');
    expect(progressBar.props.color).toBe('red');
  });
});

// Implement mock for useBudgets hook to simulate different budget states
// TODO: Implement mock for useBudgets hook to simulate different budget states

// Add tests for error handling scenarios in all components
// TODO: Add tests for error handling scenarios in all components

// Implement snapshot tests for consistent UI rendering
// TODO: Implement snapshot tests for consistent UI rendering
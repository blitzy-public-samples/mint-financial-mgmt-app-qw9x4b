import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { GoalsListScreen } from '../../src/screens/Goals/GoalsListScreen';
import { useGoals } from '../../src/hooks/useGoals';
import { GoalProgressCard } from '../../src/components/Goals/GoalProgressCard';

// Mock the hooks and components
jest.mock('../../src/hooks/useGoals');
jest.mock('../../src/components/Goals/GoalProgressCard', () => ({
  GoalProgressCard: jest.fn(() => null)
}));

describe('GoalsListScreen', () => {
  // Mock data
  const mockGoals = [
    { id: '1', name: 'Save for vacation', targetAmount: 5000, currentAmount: 2500 },
    { id: '2', name: 'Buy a car', targetAmount: 20000, currentAmount: 10000 }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (useGoals as jest.Mock).mockReturnValue({
      goals: mockGoals,
      loading: false,
      error: null,
      addGoal: jest.fn(),
      updateGoal: jest.fn(),
      deleteGoal: jest.fn()
    });
  });

  it('renders the goals list correctly', () => {
    const { getByText, getAllByTestId } = render(<GoalsListScreen />);
    
    expect(getByText('Your Financial Goals')).toBeTruthy();
    expect(getAllByTestId('goal-progress-card')).toHaveLength(mockGoals.length);
  });

  it('displays loading state', () => {
    (useGoals as jest.Mock).mockReturnValue({ goals: [], loading: true, error: null });
    const { getByTestId } = render(<GoalsListScreen />);
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('displays error state', () => {
    (useGoals as jest.Mock).mockReturnValue({ goals: [], loading: false, error: 'Failed to fetch goals' });
    const { getByText } = render(<GoalsListScreen />);
    
    expect(getByText('Failed to fetch goals')).toBeTruthy();
  });

  it('calls addGoal when add button is pressed', () => {
    const { getByTestId } = render(<GoalsListScreen />);
    const addButton = getByTestId('add-goal-button');
    
    fireEvent.press(addButton);
    
    expect(useGoals().addGoal).toHaveBeenCalled();
  });

  it('renders GoalProgressCard with correct props', () => {
    render(<GoalsListScreen />);
    
    expect(GoalProgressCard).toHaveBeenCalledWith(
      expect.objectContaining(mockGoals[0]),
      expect.any(Object)
    );
  });

  // Add more tests as needed for other interactions and edge cases
});

// Human tasks:
// 1. Implement comprehensive test coverage for all GoalsListScreen functionalities
// 2. Add integration tests for GoalsListScreen with navigation and state management
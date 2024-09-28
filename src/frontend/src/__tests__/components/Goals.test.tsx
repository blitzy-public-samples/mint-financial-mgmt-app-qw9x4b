import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { GoalsList } from '../../components/Goals/GoalsList';
import { useGoals } from '../../hooks/useGoals';
import { Goal } from '../../types/goal.types';

// Mock the useGoals hook
jest.mock('../../hooks/useGoals');

// Mock the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('GoalsList', () => {
  const mockGoals: Goal[] = [
    { id: '1', name: 'Save for vacation', targetAmount: 5000, currentAmount: 2500, targetDate: '2023-12-31' },
    { id: '2', name: 'Buy a car', targetAmount: 20000, currentAmount: 10000, targetDate: '2024-06-30' },
  ];

  beforeEach(() => {
    (useGoals as jest.Mock).mockReturnValue({
      goals: mockGoals,
      isLoading: false,
      error: null,
    });
  });

  it('renders the list of goals', () => {
    render(<GoalsList />);
    
    mockGoals.forEach((goal) => {
      expect(screen.getByText(goal.name)).toBeInTheDocument();
      expect(screen.getByText(`$${goal.currentAmount} / $${goal.targetAmount}`)).toBeInTheDocument();
    });
  });

  it('displays loading state while fetching goals', () => {
    (useGoals as jest.Mock).mockReturnValue({
      goals: [],
      isLoading: true,
      error: null,
    });

    render(<GoalsList />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles error state when fetching goals fails', () => {
    const errorMessage = 'Failed to fetch goals';
    (useGoals as jest.Mock).mockReturnValue({
      goals: [],
      isLoading: false,
      error: new Error(errorMessage),
    });

    render(<GoalsList />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('allows navigation to individual goal details', async () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);

    render(<GoalsList />);
    
    const firstGoalCard = screen.getByText(mockGoals[0].name).closest('div');
    userEvent.click(firstGoalCard!);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(`/goals/${mockGoals[0].id}`);
    });
  });

  it('includes a button to add a new goal', () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);

    render(<GoalsList />);
    
    const addGoalButton = screen.getByText(/add goal/i);
    expect(addGoalButton).toBeInTheDocument();

    userEvent.click(addGoalButton);

    expect(navigateMock).toHaveBeenCalledWith('/goals/new');
  });
});

// Human tasks:
// TODO: Implement tests for pagination or infinite scrolling if added to the component
// TODO: Add more comprehensive tests for different goal progress scenarios
// TODO: Implement tests for any additional features added to the GoalsList component
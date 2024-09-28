import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Common/Card';
import { useGoals } from '../../hooks/useGoals';
import { Goal } from '../../types/goal.types';

// GoalCard sub-component
const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/goals/${goal.id}`);
  };

  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  return (
    <Card>
      <h3>{goal.name}</h3>
      <p>Target Amount: ${goal.targetAmount.toFixed(2)}</p>
      <p>Current Amount: ${goal.currentAmount.toFixed(2)}</p>
      <p>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <button onClick={handleViewDetails}>View Details</button>
    </Card>
  );
};

// Main GoalsList component
const GoalsList: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const { fetchGoals } = useGoals();
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const fetchedGoals = await fetchGoals();
        setGoals(fetchedGoals);
      } catch (error) {
        console.error('Error fetching goals:', error);
        // TODO: Implement error handling
      }
    };

    loadGoals();
  }, [fetchGoals]);

  const handleAddGoal = () => {
    navigate('/goals/new');
  };

  return (
    <div className="goals-list">
      <h2>Financial Goals</h2>
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
      <button onClick={handleAddGoal}>Add New Goal</button>
    </div>
  );
};

export default GoalsList;

// TODO: Implement error handling for failed API calls
// TODO: Add loading state while fetching goals
// TODO: Implement pagination or infinite scrolling for large numbers of goals
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Assuming these components exist with basic props
import Chart from '../Common/Chart';
import Button from '../Common/Button';
import Card from '../Common/Card';

// Assuming this hook exists and returns budgets data
import useBudgets from '../../hooks/useBudgets';

// Define the Budget interface
interface Budget {
  id: string;
  category: string;
  budgetedAmount: number;
  currentSpending: number;
}

// Define chart options
const CHART_OPTIONS = {
  // Add chart configuration options here
};

const BudgetOverview: React.FC = () => {
  const navigate = useNavigate();
  const { budgets, isLoading, error } = useBudgets();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.budgetedAmount, 0);
  const totalSpending = budgets.reduce((sum, budget) => sum + budget.currentSpending, 0);

  const renderBudgetCategoryCard = (budget: Budget) => {
    const percentageUsed = (budget.currentSpending / budget.budgetedAmount) * 100;

    return (
      <Card key={budget.id}>
        <h3>{budget.category}</h3>
        <p>Budgeted: ${budget.budgetedAmount.toFixed(2)}</p>
        <p>Spent: ${budget.currentSpending.toFixed(2)}</p>
        <p>Used: {percentageUsed.toFixed(2)}%</p>
        <div className="progress-bar" style={{ width: `${percentageUsed}%` }}></div>
        <Button onClick={() => navigate(`/budgets/${budget.id}`)}>View Details</Button>
      </Card>
    );
  };

  return (
    <div className="budget-overview">
      <h1>Budget Overview</h1>
      <Card>
        <h2>Summary</h2>
        <p>Total Budget: ${totalBudget.toFixed(2)}</p>
        <p>Total Spending: ${totalSpending.toFixed(2)}</p>
        <Chart data={budgets} options={CHART_OPTIONS} />
      </Card>
      <div className="budget-categories">
        {budgets.map(renderBudgetCategoryCard)}
      </div>
      <Button onClick={() => navigate('/budgets/create')}>Create New Budget</Button>
    </div>
  );
};

export default BudgetOverview;

// TODO: Implement proper error handling for budget data fetching
// TODO: Add accessibility attributes to ensure the component is usable by screen readers
// TODO: Implement responsive design to ensure proper display on various screen sizes
// TODO: Add unit tests for the BudgetOverview component
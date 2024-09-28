import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chart from '../Common/Chart';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Modal from '../Common/Modal';

// Assuming the useBudgets hook will be implemented later
const useBudgets = () => {
  // Mock implementation
  return {
    getBudget: (id: string) => Promise.resolve({ id, name: 'Mock Budget', amount: 1000, spent: 500 }),
    updateBudget: (id: string, data: any) => Promise.resolve(data),
    deleteBudget: (id: string) => Promise.resolve(),
  };
};

interface SpendingData {
  category: string;
  amount: number;
}

const BudgetDetails: React.FC = () => {
  const { budgetId } = useParams<{ budgetId: string }>();
  const navigate = useNavigate();
  const { getBudget, updateBudget, deleteBudget } = useBudgets();

  const [budget, setBudget] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [spendingData, setSpendingData] = useState<SpendingData[]>([]);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        if (budgetId) {
          const budgetData = await getBudget(budgetId);
          setBudget(budgetData);
          // Mock spending data - replace with actual data fetching
          setSpendingData([
            { category: 'Food', amount: 300 },
            { category: 'Transport', amount: 150 },
            { category: 'Entertainment', amount: 50 },
          ]);
        }
      } catch (err) {
        setError('Failed to fetch budget details');
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, [budgetId, getBudget]);

  const handleEditBudget = () => {
    // Navigate to edit page or open edit modal
    navigate(`/budgets/edit/${budgetId}`);
  };

  const handleDeleteBudget = async () => {
    try {
      if (budgetId) {
        await deleteBudget(budgetId);
        navigate('/budgets');
      }
    } catch (err) {
      setError('Failed to delete budget');
    }
  };

  const renderSpendingBreakdown = (spendingData: SpendingData[]) => {
    return (
      <div className="spending-breakdown">
        {spendingData.map((item, index) => (
          <Card key={index}>
            <h3>{item.category}</h3>
            <p>${item.amount}</p>
            <p>{((item.amount / (budget?.amount || 1)) * 100).toFixed(2)}% of budget</p>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!budget) return <div>Budget not found</div>;

  return (
    <div className="budget-details">
      <h1>{budget.name}</h1>
      <Card>
        <h2>Budget Summary</h2>
        <p>Total Budget: ${budget.amount}</p>
        <p>Spent: ${budget.spent}</p>
        <p>Remaining: ${budget.amount - budget.spent}</p>
      </Card>

      <Chart
        data={spendingData}
        type="pie"
        options={{ responsive: true }}
      />

      <h2>Spending Breakdown</h2>
      {renderSpendingBreakdown(spendingData)}

      <div className="budget-actions">
        <Button onClick={handleEditBudget}>Edit Budget</Button>
        <Button onClick={() => setShowDeleteModal(true)} variant="danger">Delete Budget</Button>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete this budget?</p>
        <Button onClick={handleDeleteBudget} variant="danger">Yes, Delete</Button>
        <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
      </Modal>
    </div>
  );
};

export default BudgetDetails;

// Human tasks:
// TODO: Implement proper error handling for budget data fetching and operations
// TODO: Add accessibility attributes to ensure the component is usable by screen readers
// TODO: Implement responsive design to ensure proper display on various screen sizes
// TODO: Add unit tests for the BudgetDetails component and its helper functions
// TODO: Implement data caching strategy to improve performance for frequently accessed budgets
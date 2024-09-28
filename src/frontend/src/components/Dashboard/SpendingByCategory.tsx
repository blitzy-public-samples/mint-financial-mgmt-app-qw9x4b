import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// TODO: Import the actual hook once it's implemented
// import { useTransactions } from '../../hooks/useTransactions';

// TODO: Import the actual formatter once it's implemented
// import { formatCurrency } from '../../utils/formatters';

// Placeholder for the useTransactions hook
const useTransactions = () => {
  return {
    transactions: [],
    isLoading: false,
    error: null,
  };
};

// Placeholder for the formatCurrency function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

interface SpendingCategory {
  name: string;
  amount: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C'];

const SpendingByCategory: React.FC = () => {
  const { transactions, isLoading, error } = useTransactions();
  const [spendingData, setSpendingData] = useState<SpendingCategory[]>([]);

  useEffect(() => {
    if (transactions.length > 0) {
      const aggregatedData = aggregateSpendingByCategory(transactions);
      setSpendingData(aggregatedData);
    }
  }, [transactions]);

  const aggregateSpendingByCategory = (transactions: any[]): SpendingCategory[] => {
    const categoryMap = new Map<string, number>();

    transactions.forEach((transaction) => {
      const { category, amount } = transaction;
      if (amount < 0) { // Only consider expenses
        const currentAmount = categoryMap.get(category) || 0;
        categoryMap.set(category, currentAmount + Math.abs(amount));
      }
    });

    const aggregatedData = Array.from(categoryMap, ([name, amount]) => ({ name, amount }));
    return aggregatedData.sort((a, b) => b.amount - a.amount);
  };

  if (isLoading) {
    return <div>Loading spending data...</div>;
  }

  if (error) {
    return <div>Error loading spending data: {error.message}</div>;
  }

  return (
    <div className="spending-by-category">
      <h2>Spending by Category</h2>
      {spendingData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={spendingData}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {spendingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p>No spending data available.</p>
      )}
      <div className="category-legend">
        {spendingData.map((category, index) => (
          <div key={category.name} className="category-item">
            <span className="category-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
            <span className="category-name">{category.name}</span>
            <span className="category-amount">{formatCurrency(category.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingByCategory;

// TODO: Implement error handling for failed data fetching
// TODO: Add loading state while fetching transaction data
// TODO: Implement unit tests for the SpendingByCategory component
// TODO: Add accessibility attributes to the chart for screen readers
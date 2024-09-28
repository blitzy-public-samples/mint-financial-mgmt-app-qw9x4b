import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTransactions } from '../hooks/useTransactions';
import Card from '../Common/Card';
import { formatCurrency, formatDate } from '../utils/formatters';

// Define types
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface TransactionListProps {
  // Add any props if needed
}

// Styled components
const TransactionListContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const TransactionItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
`;

const Amount = styled.span<{ isExpense: boolean }>`
  color: ${(props) => (props.isExpense ? 'red' : 'green')};
  font-weight: bold;
`;

const NoTransactions = styled.p`
  text-align: center;
  color: #888;
`;

// TransactionItem sub-component
const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const isExpense = transaction.amount < 0;

  return (
    <TransactionItemWrapper>
      <div>
        <div>{formatDate(transaction.date)}</div>
        <div>{transaction.description}</div>
        <div>{transaction.category}</div>
      </div>
      <Amount isExpense={isExpense}>{formatCurrency(transaction.amount)}</Amount>
    </TransactionItemWrapper>
  );
};

// Main TransactionList component
const TransactionList: React.FC<TransactionListProps> = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { getTransactions } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const result = await getTransactions(page);
      if (result.transactions.length === 0) {
        setHasMore(false);
      } else {
        setTransactions((prevTransactions) => [...prevTransactions, ...result.transactions]);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch transactions. Please try again.');
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <TransactionListContainer>
      <h2>Transactions</h2>
      {transactions.length === 0 && !loading ? (
        <NoTransactions>No transactions found.</NoTransactions>
      ) : (
        <Card>
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </Card>
      )}
      {loading && <div>Loading...</div>}
      {hasMore && !loading && (
        <button onClick={loadMore}>Load More</button>
      )}
    </TransactionListContainer>
  );
};

export default TransactionList;
```

This implementation includes the following features and considerations:

1. We've created a responsive layout using styled-components.
2. The component uses the `useTransactions` hook to fetch transaction data.
3. We've implemented pagination with a "Load More" button to fetch additional transactions.
4. Transactions are displayed using the `Card` component for consistent styling.
5. Each transaction is rendered using the `TransactionItem` sub-component, which formats the date and amount using the utility functions.
6. Error handling and loading states are included for a better user experience.
7. The component is typed using TypeScript for improved maintainability.

Human tasks that need to be addressed:

```
// TODO: Implement actual API integration for fetching transactions
// TODO: Design and implement UI for sorting and filtering transactions
// TODO: Optimize performance for large transaction lists
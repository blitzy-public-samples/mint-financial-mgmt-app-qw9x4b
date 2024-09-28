import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card from '../Common/Card';
import Loader from '../Common/Loader';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency, formatDate } from '../../utils/formatters';

// Styled components for the transaction list and items
const TransactionList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const TransactionItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionDate = styled.span`
  font-size: 0.9em;
  color: #666;
`;

const TransactionDescription = styled.span`
  flex-grow: 1;
  margin: 0 10px;
`;

const TransactionAmount = styled.span`
  font-weight: bold;
`;

const ErrorMessage = styled.p`
  color: #e53935;
  text-align: center;
`;

const RecentTransactions: React.FC = () => {
  const { transactions, loading, error } = useTransactions();
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (transactions) {
      // Sort transactions by date (most recent first) and take the top 5
      const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentTransactions(sorted.slice(0, 5));
    }
  }, [transactions]);

  return (
    <Card title="Recent Transactions">
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage>Error loading transactions. Please try again later.</ErrorMessage>
      ) : (
        <TransactionList>
          {recentTransactions.map((transaction) => (
            <TransactionItem key={transaction.id}>
              <TransactionDate>{formatDate(transaction.date)}</TransactionDate>
              <TransactionDescription>{transaction.description}</TransactionDescription>
              <TransactionAmount>{formatCurrency(transaction.amount)}</TransactionAmount>
            </TransactionItem>
          ))}
        </TransactionList>
      )}
    </Card>
  );
};

export default RecentTransactions;

// TODO: Implement proper error handling and user feedback for failed transaction fetching
// TODO: Add pagination or 'Load More' functionality for viewing older transactions
// TODO: Implement click-through functionality to view full transaction details
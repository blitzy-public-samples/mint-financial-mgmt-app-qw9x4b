import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../Common/Card';
import Button from '../Common/Button';
import useTransactions from '../../hooks/useTransactions';
import { Transaction } from '../../types/transaction.types';

// Helper function to format date
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to format amount
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const TransactionDetails: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const { getTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) return;
      
      try {
        setIsLoading(true);
        const fetchedTransaction = await getTransaction(transactionId);
        setTransaction(fetchedTransaction);
        setError(null);
      } catch (err) {
        setError('Failed to fetch transaction details. Please try again.');
        console.error('Error fetching transaction:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, getTransaction]);

  const handleEdit = () => {
    // Navigate to edit transaction page
    navigate(`/transactions/edit/${transactionId}`);
  };

  const handleDelete = async () => {
    if (!transaction) return;

    try {
      await deleteTransaction(transaction.id);
      navigate('/transactions');
    } catch (err) {
      setError('Failed to delete transaction. Please try again.');
      console.error('Error deleting transaction:', err);
    }
  };

  if (isLoading) {
    return <div>Loading transaction details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!transaction) {
    return <div>Transaction not found.</div>;
  }

  return (
    <Card>
      <h2>Transaction Details</h2>
      <div>
        <p><strong>Date:</strong> {formatDate(transaction.date)}</p>
        <p><strong>Description:</strong> {transaction.description}</p>
        <p><strong>Amount:</strong> {formatAmount(transaction.amount)}</p>
        <p><strong>Category:</strong> {transaction.category}</p>
        <p><strong>Account:</strong> {transaction.account}</p>
      </div>
      <div>
        <Button onClick={handleEdit}>Edit</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </div>
    </Card>
  );
};

export default TransactionDetails;
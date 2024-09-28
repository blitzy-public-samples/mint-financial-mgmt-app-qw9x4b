import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import Input from '../Common/Input';
import { addTransaction } from '../../services/transaction.service';
import { validateTransactionInput } from '../../utils/validators';
import { Transaction } from '../../types/transaction.types';

interface TransactionDetails {
  amount: string;
  description: string;
  category: string;
  date: string;
}

interface FormErrors {
  amount?: string;
  description?: string;
  category?: string;
  date?: string;
}

const AddTransaction: React.FC = () => {
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails>({
    amount: '',
    description: '',
    category: '',
    date: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTransactionDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateTransactionInput(transactionDetails);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const newTransaction: Transaction = {
        ...transactionDetails,
        amount: parseFloat(transactionDetails.amount),
        date: new Date(transactionDetails.date),
      };

      const addedTransaction = await addTransaction(newTransaction);
      dispatch({ type: 'ADD_TRANSACTION', payload: addedTransaction });
      navigate('/transactions');
    } catch (error) {
      setFormErrors({ description: 'Failed to add transaction. Please try again.' });
    }
  };

  return (
    <div className="add-transaction">
      <h2>Add New Transaction</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="number"
          name="amount"
          value={transactionDetails.amount}
          onChange={handleInputChange}
          placeholder="Amount"
          error={formErrors.amount}
        />
        <Input
          type="text"
          name="description"
          value={transactionDetails.description}
          onChange={handleInputChange}
          placeholder="Description"
          error={formErrors.description}
        />
        <Input
          type="text"
          name="category"
          value={transactionDetails.category}
          onChange={handleInputChange}
          placeholder="Category"
          error={formErrors.category}
        />
        <Input
          type="date"
          name="date"
          value={transactionDetails.date}
          onChange={handleInputChange}
          error={formErrors.date}
        />
        <Button type="submit">Add Transaction</Button>
      </form>
    </div>
  );
};

export default AddTransaction;

// TODO: Implement proper error handling and user feedback for failed transactions
// TODO: Add form validation for date format and future dates
// TODO: Implement category selection from a predefined list of categories
// TODO: Add support for recurring transactions (Optional)
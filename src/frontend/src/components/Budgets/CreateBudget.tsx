import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import Input from '../Common/Input';
import Card from '../Common/Card';
import { useBudgets } from '../../hooks/useBudgets';
import { formatCurrency } from '../../utils/formatters';
import { validateBudgetInput } from '../../utils/validators';

interface BudgetFormData {
  name: string;
  amount: string;
  category: string;
  period: string;
}

const CreateBudget: React.FC = () => {
  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    amount: '',
    category: '',
    period: 'monthly', // Default to monthly
  });
  const [errors, setErrors] = useState<Partial<BudgetFormData>>({});
  const { createBudget } = useBudgets();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateBudgetInput(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        await createBudget({
          ...formData,
          amount: parseFloat(formData.amount),
        });
        navigate('/budgets'); // Redirect to budgets list after creation
      } catch (error) {
        console.error('Error creating budget:', error);
        setErrors({ name: 'Failed to create budget. Please try again.' });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Card>
      <h2>Create New Budget</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Budget Name"
          error={errors.name}
        />
        <Input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="Budget Amount"
          error={errors.amount}
        />
        <Input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="Category"
          error={errors.category}
        />
        <select
          name="period"
          value={formData.period}
          onChange={handleInputChange}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        {errors.period && <p className="error">{errors.period}</p>}
        <Button type="submit">Create Budget</Button>
      </form>
    </Card>
  );
};

export default CreateBudget;

// TODO: Implement the useBudgets hook with createBudget function
// TODO: Implement the formatCurrency utility function
// TODO: Implement the validateBudgetInput utility function
// TODO: Define budget types in src/frontend/src/types/budget.types.ts
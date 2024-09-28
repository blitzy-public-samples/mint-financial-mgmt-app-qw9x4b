import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import Input from '../Common/Input';
import { useGoals } from '../../hooks/useGoals';
import { validateGoalInput } from '../../utils/validators';

interface GoalFormData {
  name: string;
  targetAmount: string;
  targetDate: string;
}

interface FormErrors {
  name?: string;
  targetAmount?: string;
  targetDate?: string;
}

const CreateGoal: React.FC = () => {
  const [formData, setFormData] = useState<GoalFormData>({
    name: '',
    targetAmount: '',
    targetDate: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { createGoal } = useGoals();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate input and update errors
    const validationError = validateGoalInput(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationError,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const formErrors: FormErrors = {
      name: validateGoalInput('name', formData.name),
      targetAmount: validateGoalInput('targetAmount', formData.targetAmount),
      targetDate: validateGoalInput('targetDate', formData.targetDate),
    };

    setErrors(formErrors);

    // Check if there are any errors
    if (Object.values(formErrors).some((error) => error !== undefined)) {
      return;
    }

    try {
      await createGoal({
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        targetDate: new Date(formData.targetDate),
      });
      navigate('/goals'); // Navigate to goals list after successful creation
    } catch (error) {
      console.error('Error creating goal:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="create-goal">
      <h2>Create New Goal</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Goal Name"
          error={errors.name}
        />
        <Input
          type="number"
          name="targetAmount"
          value={formData.targetAmount}
          onChange={handleInputChange}
          placeholder="Target Amount"
          error={errors.targetAmount}
        />
        <Input
          type="date"
          name="targetDate"
          value={formData.targetDate}
          onChange={handleInputChange}
          placeholder="Target Date"
          error={errors.targetDate}
        />
        <Button type="submit">Create Goal</Button>
      </form>
    </div>
  );
};

export default CreateGoal;

// TODO: Implement proper error handling and display error messages to the user
// TODO: Add form validation for the target date to ensure it's a future date
// TODO: Implement a date picker component for better user experience when selecting the target date
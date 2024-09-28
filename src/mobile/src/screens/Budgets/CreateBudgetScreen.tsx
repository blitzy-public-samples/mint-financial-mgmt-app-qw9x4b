import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useBudgets } from '../hooks/useBudgets';
import { validateBudgetInput } from '../utils/validators';
import { Budget } from '../types/budget.types';

const CreateBudgetScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const { createBudget } = useBudgets();
  const navigation = useNavigation();

  const handleCreateBudget = () => {
    const validationError = validateBudgetInput({ name, amount, category });
    if (validationError) {
      setError(validationError);
      return;
    }

    const newBudget: Budget = {
      name,
      amount: parseFloat(amount),
      category,
    };

    createBudget(newBudget)
      .then(() => {
        navigation.goBack();
      })
      .catch((err) => {
        setError('Failed to create budget. Please try again.');
        console.error('Error creating budget:', err);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Budget</Text>
      <Input
        label="Budget Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter budget name"
      />
      <Input
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter budget amount"
        keyboardType="numeric"
      />
      <Input
        label="Category"
        value={category}
        onChangeText={setCategory}
        placeholder="Enter budget category"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Create Budget" onPress={handleCreateBudget} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});

export default CreateBudgetScreen;

// TODO: Implement proper error handling and user feedback for budget creation failures
// TODO: Add form validation with real-time feedback as the user types
// TODO: Implement a date picker for selecting the budget period
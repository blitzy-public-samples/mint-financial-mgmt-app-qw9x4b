import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// TODO: Import the actual Button component once it's implemented
// import { Button } from '../components/common/Button';
// TODO: Import the actual Input component once it's implemented
// import { Input } from '../components/common/Input';
// TODO: Import the actual useGoals hook once it's implemented
// import { useGoals } from '../hooks/useGoals';
// TODO: Import the actual validateGoalInput function once it's implemented
// import { validateGoalInput } from '../utils/validators';

// Placeholder components and functions
const Button = ({ title, onPress }) => (
  <View style={styles.button}>
    <Text onPress={onPress}>{title}</Text>
  </View>
);

const Input = ({ placeholder, value, onChangeText }) => (
  <View style={styles.input}>
    <Text>{placeholder}</Text>
    <TextInput value={value} onChangeText={onChangeText} />
  </View>
);

const useGoals = () => ({
  createGoal: async (goal) => {
    console.log('Creating goal:', goal);
    // Implement actual goal creation logic
  },
});

const validateGoalInput = (name, targetAmount, targetDate) => {
  const errors = {};
  if (!name) errors.name = 'Name is required';
  if (!targetAmount) errors.targetAmount = 'Target amount is required';
  if (!targetDate) errors.targetDate = 'Target date is required';
  return errors;
};

const CreateGoalScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [errors, setErrors] = useState({});

  const { createGoal } = useGoals();
  const navigation = useNavigation();

  const handleCreateGoal = async () => {
    const validationErrors = validateGoalInput(name, targetAmount, targetDate);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createGoal({ name, targetAmount: parseFloat(targetAmount), targetDate: new Date(targetDate) });
      navigation.goBack();
    } catch (error) {
      setErrors({ submit: 'Failed to create goal. Please try again.' });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Goal</Text>
      
      <Input
        placeholder="Goal Name"
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <Input
        placeholder="Target Amount"
        value={targetAmount}
        onChangeText={setTargetAmount}
        keyboardType="numeric"
      />
      {errors.targetAmount && <Text style={styles.errorText}>{errors.targetAmount}</Text>}

      <Input
        placeholder="Target Date (YYYY-MM-DD)"
        value={targetDate}
        onChangeText={setTargetDate}
      />
      {errors.targetDate && <Text style={styles.errorText}>{errors.targetDate}</Text>}

      {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}

      <Button title="Create Goal" onPress={handleCreateGoal} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1E88E5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

export default CreateGoalScreen;
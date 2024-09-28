import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../types/transaction.types';
import { validateTransaction } from '../utils/validators';

const AddTransactionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { addTransaction } = useTransactions();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async () => {
    try {
      const transactionData: Partial<Transaction> = {
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        category,
      };

      const validationResult = validateTransaction(transactionData);
      if (!validationResult.isValid) {
        Alert.alert('Validation Error', validationResult.errors.join('\n'));
        return;
      }

      await addTransaction(transactionData as Transaction);
      Alert.alert('Success', 'Transaction added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Transaction</Text>
      <Input
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Enter amount"
      />
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
      />
      <Input
        label="Date"
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
      />
      <Input
        label="Category"
        value={category}
        onChangeText={setCategory}
        placeholder="Enter category"
      />
      <Button title="Add Transaction" onPress={handleSubmit} />
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
});

export default AddTransactionScreen;

// Human tasks:
// 1. Implement proper error handling and user feedback mechanisms
// 2. Add form validation rules specific to the business requirements
// 3. Implement category selection functionality (possibly using a dropdown or modal)
// 4. Add date picker functionality for selecting the transaction date
// 5. Implement proper keyboard handling and input focus management
// 6. Add accessibility features to ensure the form is usable by all users
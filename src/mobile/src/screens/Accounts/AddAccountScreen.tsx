import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAccounts } from '../hooks/useAccounts';
import { AccountService } from '../services/account.service';

const AddAccountScreen: React.FC = () => {
  const navigation = useNavigation();
  const { addAccount } = useAccounts();
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [balance, setBalance] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const newAccount = {
          name: accountName,
          type: accountType,
          balance: parseFloat(balance),
          accountNumber,
          routingNumber,
        };
        await addAccount(newAccount);
        navigation.goBack();
      } catch (err) {
        setError('Failed to add account. Please try again.');
      }
    }
  };

  const validateForm = (): boolean => {
    if (!accountName || !accountType || !balance) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (isNaN(parseFloat(balance))) {
      setError('Please enter a valid balance.');
      return false;
    }
    // Add more validation as needed
    setError('');
    return true;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Account</Text>
      <Input
        label="Account Name"
        value={accountName}
        onChangeText={setAccountName}
        placeholder="Enter account name"
      />
      <Input
        label="Account Type"
        value={accountType}
        onChangeText={setAccountType}
        placeholder="e.g., Checking, Savings, Credit Card"
      />
      <Input
        label="Balance"
        value={balance}
        onChangeText={setBalance}
        placeholder="Enter current balance"
        keyboardType="numeric"
      />
      <Input
        label="Account Number"
        value={accountNumber}
        onChangeText={setAccountNumber}
        placeholder="Enter account number"
        keyboardType="numeric"
      />
      <Input
        label="Routing Number"
        value={routingNumber}
        onChangeText={setRoutingNumber}
        placeholder="Enter routing number"
        keyboardType="numeric"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Add Account" onPress={handleSubmit} />
    </ScrollView>
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

export default AddAccountScreen;

// Human tasks:
// 1. Implement proper error handling and user feedback mechanisms
// 2. Integrate with a financial data aggregation service API for real account connections
// 3. Implement secure storage for sensitive account information
// 4. Add support for different types of accounts (checking, savings, credit card, investment, etc.)
// 5. Implement input masking for sensitive fields like account numbers
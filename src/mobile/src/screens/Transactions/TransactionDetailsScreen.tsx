import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Assuming these components will be implemented with similar props
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

// Assuming these hooks and services will be implemented
import { useTransactions } from '../hooks/useTransactions';
import { transactionService } from '../services/transaction.service';

// Assuming these utility functions will be implemented
import { formatCurrency, formatDate } from '../utils/formatters';

// Assuming this type will be defined
import { Transaction } from '../types/transaction.types';

type TransactionDetailsScreenProps = {
  route: RouteProp<{ params: { transactionId: string } }, 'params'>;
  navigation: StackNavigationProp<any, any>;
};

const TransactionDetailsScreen: React.FC<TransactionDetailsScreenProps> = ({ route, navigation }) => {
  const { transactionId } = route.params;
  const { getTransaction, updateTransaction } = useTransactions();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const fetchedTransaction = await getTransaction(transactionId);
        setTransaction(fetchedTransaction);
      } catch (error) {
        console.error('Error fetching transaction:', error);
        // TODO: Implement error handling and display error messages to the user
      }
    };

    fetchTransaction();
  }, [transactionId, getTransaction]);

  const handleInputChange = (field: keyof Transaction, value: string) => {
    if (transaction) {
      setTransaction({ ...transaction, [field]: value });
    }
  };

  const handleSave = async () => {
    if (transaction) {
      try {
        await updateTransaction(transaction);
        setIsEditing(false);
        // TODO: Implement a confirmation dialog before saving changes
        navigation.goBack();
      } catch (error) {
        console.error('Error updating transaction:', error);
        // TODO: Implement error handling and display error messages to the user
      }
    }
  };

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.title}>Transaction Details</Text>
        {isEditing ? (
          <>
            <Input
              label="Description"
              value={transaction.description}
              onChangeText={(value) => handleInputChange('description', value)}
            />
            <Input
              label="Amount"
              value={transaction.amount.toString()}
              onChangeText={(value) => handleInputChange('amount', value)}
              keyboardType="numeric"
            />
            <Input
              label="Date"
              value={transaction.date}
              onChangeText={(value) => handleInputChange('date', value)}
            />
            <Input
              label="Category"
              value={transaction.category}
              onChangeText={(value) => handleInputChange('category', value)}
            />
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={() => setIsEditing(false)} />
          </>
        ) : (
          <>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{transaction.description}</Text>
            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.value}>{formatCurrency(transaction.amount)}</Text>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{formatDate(transaction.date)}</Text>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{transaction.category}</Text>
            <Button title="Edit" onPress={() => setIsEditing(true)} />
          </>
        )}
      </Card>
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default TransactionDetailsScreen;
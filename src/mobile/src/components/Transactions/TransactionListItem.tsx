import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Transaction } from '../../types/transaction.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../common/Card';

interface TransactionListItemProps {
  transaction: Transaction;
  onPress: () => void;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction, onPress }) => {
  // Destructure props to access transaction and onPress
  const { date, description, amount } = transaction;

  // Format the transaction amount using formatCurrency
  const formattedAmount = formatCurrency(amount);

  // Format the transaction date using formatDate
  const formattedDate = formatDate(date);

  return (
    <TouchableOpacity onPress={onPress}>
      <Card>
        <View style={styles.container}>
          <View style={styles.leftContent}>
            <Text style={styles.date}>{formattedDate}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <View style={styles.rightContent}>
            <Text style={styles.amount}>{formattedAmount}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionListItem;
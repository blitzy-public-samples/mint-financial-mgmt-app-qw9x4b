import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import Card from '../common/Card';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency } from '../../utils/formatters';

// Define the Transaction interface
interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

// Define the props interface for the RecentTransactionsWidget
interface RecentTransactionsWidgetProps {
  limit: number;
}

// Define the RecentTransactionsWidget component
const RecentTransactionsWidget: React.FC<RecentTransactionsWidgetProps> = ({ limit }) => {
  // Use the useTransactions hook to fetch recent transactions
  const { transactions, loading, error } = useTransactions(limit);

  // Render function for individual transaction items
  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={styles.transactionAmount}>
        {formatCurrency(item.amount)}
      </Text>
    </View>
  );

  return (
    <Card>
      <Text style={styles.title}>Recent Transactions</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Card>
  );
};

// Define styles for the component
const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RecentTransactionsWidget;
```

This implementation of the RecentTransactionsWidget component follows the provided specification and includes the following features:

1. It imports the necessary dependencies, including React, React Native components, and the custom hooks and utilities.
2. It defines the Transaction interface as specified.
3. It defines the RecentTransactionsWidgetProps interface with the limit property.
4. The component uses the useTransactions hook to fetch recent transactions based on the provided limit.
5. It renders a Card component as the container for the widget.
6. The component displays a title "Recent Transactions".
7. It uses a FlatList to render the list of transactions efficiently.
8. Each transaction item displays the description, date, and formatted amount.
9. The component handles loading and error states.
10. Styles are applied to the component elements using StyleSheet.create.

Note that this implementation assumes the following:

1. The Card component from '../common/Card' exists and accepts children as props.
2. The useTransactions hook from '../../hooks/useTransactions' exists and returns an object with transactions, loading, and error properties.
3. The formatCurrency function from '../../utils/formatters' exists and formats the amount as currency.

Here are the pending human tasks related to this component:

```
// Pending human tasks:
// 1. Implement the useTransactions hook to fetch recent transactions from the API (Required)
// 2. Create and implement the formatCurrency utility function (Required)
// 3. Design and implement a color scheme for transaction categories (Optional)
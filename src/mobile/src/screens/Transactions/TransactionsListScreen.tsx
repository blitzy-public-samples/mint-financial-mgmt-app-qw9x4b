import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TransactionListItem from '../components/Transactions/TransactionListItem';
import useTransactions from '../hooks/useTransactions';
import Loader from '../components/common/Loader';

// Define the Transaction type
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

const TransactionsListScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const navigation = useNavigation();
  const { fetchTransactions } = useTransactions();

  // Fetch transactions on component mount
  useEffect(() => {
    loadTransactions();
  }, []);

  // Load transactions from the API
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const fetchedTransactions = await fetchTransactions();
      setTransactions(fetchedTransactions);
      setError(null);
    } catch (err) {
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort transactions based on date
  const sortedTransactions = filteredTransactions.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Render individual transaction item
  const renderTransactionItem = useCallback(({ item }: { item: Transaction }) => (
    <TransactionListItem
      transaction={item}
      onPress={() => navigation.navigate('TransactionDetails', { transactionId: item.id })}
    />
  ), [navigation]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadTransactions}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search transactions..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
        <Text style={styles.sortButtonText}>
          Sort by Date ({sortOrder === 'asc' ? 'Oldest' : 'Newest'})
        </Text>
      </TouchableOpacity>
      <FlatList
        data={sortedTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  sortButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  sortButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listContainer: {
    flexGrow: 1,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TransactionsListScreen;
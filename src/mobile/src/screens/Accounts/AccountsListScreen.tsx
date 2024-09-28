import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AccountListItem from '../components/Accounts/AccountListItem';
import useAccounts from '../../hooks/useAccounts';
import Loader from '../../components/common/Loader';

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
}

const AccountsListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { accounts, loading, error } = useAccounts();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fetch accounts when component mounts
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    // This function would typically be part of the useAccounts hook
    // For now, we'll just simulate the loading state
    setRefreshing(true);
    // Simulating API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderAccountItem = ({ item }: { item: Account }) => (
    <AccountListItem
      account={item}
      onPress={() => navigation.navigate('AccountDetails', { accountId: item.id })}
    />
  );

  const handleAddAccount = () => {
    navigation.navigate('AddAccount');
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        renderItem={renderAccountItem}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={fetchAccounts}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No accounts found. Add an account to get started.</Text>
        }
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddAccount}>
        <Text style={styles.addButtonText}>Add Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#1E88E5',
    padding: 15,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccountsListScreen;

// Human tasks:
// TODO: Implement actual navigation to AccountDetailsScreen when an account is pressed
// TODO: Implement actual navigation to AddAccountScreen when the 'Add Account' button is pressed
// TODO: Design and implement error handling UI for failed account fetching
// TODO: Optimize performance for large numbers of accounts (e.g., implement pagination or virtual list)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAccounts } from '../hooks/useAccounts';
import { formatCurrency } from '../utils/formatters';

const NetWorthWidget: React.FC = () => {
  const [netWorth, setNetWorth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { accounts, isLoading: accountsLoading, error: accountsError } = useAccounts();

  useEffect(() => {
    if (accounts && !accountsLoading) {
      calculateNetWorth();
    }
  }, [accounts, accountsLoading]);

  const calculateNetWorth = () => {
    try {
      const totalAssets = accounts.reduce((sum, account) => {
        return sum + (account.type === 'asset' ? account.balance : 0);
      }, 0);

      const totalLiabilities = accounts.reduce((sum, account) => {
        return sum + (account.type === 'liability' ? account.balance : 0);
      }, 0);

      const calculatedNetWorth = totalAssets - totalLiabilities;
      setNetWorth(calculatedNetWorth);
      setIsLoading(false);
    } catch (err) {
      setError('Error calculating net worth');
      setIsLoading(false);
    }
  };

  if (isLoading || accountsLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error || accountsError) {
    return (
      <View style={styles.container}>
        <Text>Error: {error || accountsError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Net Worth</Text>
      <Text style={styles.netWorthValue}>{formatCurrency(netWorth)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  netWorthValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default NetWorthWidget;

// TODO: Implement error handling for failed account data fetching
// TODO: Add loading state while fetching account data
// TODO: Implement refresh functionality to update net worth on demand
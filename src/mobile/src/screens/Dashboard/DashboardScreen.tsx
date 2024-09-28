import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NetWorthWidget from '../components/Dashboard/NetWorthWidget';
import RecentTransactionsWidget from '../components/Dashboard/RecentTransactionsWidget';
import SpendingByCategoryWidget from '../components/Dashboard/SpendingByCategoryWidget';
import FinancialInsightsWidget from '../components/Dashboard/FinancialInsightsWidget';
import { useAuth } from '../../hooks/useAuth';

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // TODO: Implement refresh logic here
    // This should update the data for all widgets
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Text style={styles.welcomeText}>Welcome, {user?.firstName}!</Text>
      <NetWorthWidget />
      <RecentTransactionsWidget />
      <SpendingByCategoryWidget />
      <FinancialInsightsWidget />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
});

export default DashboardScreen;
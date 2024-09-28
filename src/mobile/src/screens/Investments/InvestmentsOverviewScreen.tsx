import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// TODO: Implement these components and hooks
import InvestmentSummaryCard from '../components/Investments/InvestmentSummaryCard';
import useInvestments from '../../hooks/useInvestments';
import { Investment } from '../../types/investment.types';

const InvestmentsOverviewScreen: React.FC = () => {
  const navigation = useNavigation();
  const { investments, totalValue, overallPerformance, isLoading, refetch } = useInvestments();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderInvestmentItem = ({ item }: { item: Investment }) => (
    <InvestmentSummaryCard
      investment={item}
      onPress={() => navigation.navigate('InvestmentDetails', { investmentId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Investments Overview</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.totalValue}>Total Portfolio Value: ${totalValue.toFixed(2)}</Text>
        <Text style={styles.performance}>
          Overall Performance: {overallPerformance >= 0 ? '+' : ''}{overallPerformance.toFixed(2)}%
        </Text>
      </View>
      <FlatList
        data={investments}
        renderItem={renderInvestmentItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No investments found. Start investing to see your portfolio here.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  performance: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#666',
  },
});

export default InvestmentsOverviewScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { FinancialInsight } from '../../types';

interface FinancialInsightsWidgetProps {}

const FinancialInsightsWidget: React.FC<FinancialInsightsWidgetProps> = () => {
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchFinancialInsights();
  }, []);

  const fetchFinancialInsights = async () => {
    try {
      const response = await api.get('/financial-insights');
      setInsights(response.data);
    } catch (error) {
      console.error('Error fetching financial insights:', error);
      // TODO: Implement error handling
    }
  };

  const renderInsightItem = ({ item }: { item: FinancialInsight }) => (
    <View style={styles.insightItem}>
      <Text style={styles.insightTitle}>{item.title}</Text>
      <Text style={styles.insightDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Financial Insights</Text>
      <FlatList
        data={insights}
        renderItem={renderInsightItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No insights available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  insightItem: {
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default FinancialInsightsWidget;

// TODO: Implement error handling for API calls
// TODO: Add loading state and spinner while fetching insights
// TODO: Implement pull-to-refresh functionality for updating insights
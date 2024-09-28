import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCreditScore } from '../../hooks/useCreditScore';
import { Chart } from '../../components/common/Chart';
import { Loader } from '../../components/common/Loader';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { theme } from '../../constants/theme';

interface CreditScoreData {
  date: string;
  score: number;
}

const CreditScoreHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { getCreditScoreHistory, loading, error } = useCreditScore();
  const [creditScoreHistory, setCreditScoreHistory] = useState<CreditScoreData[]>([]);

  useEffect(() => {
    const fetchCreditScoreHistory = async () => {
      try {
        const history = await getCreditScoreHistory();
        setCreditScoreHistory(history);
      } catch (err) {
        console.error('Error fetching credit score history:', err);
      }
    };

    fetchCreditScoreHistory();
  }, [getCreditScoreHistory]);

  const renderChart = () => {
    if (creditScoreHistory.length === 0) {
      return <Text style={styles.noDataText}>No credit score history available</Text>;
    }

    const chartData = {
      labels: creditScoreHistory.map(item => item.date),
      datasets: [
        {
          data: creditScoreHistory.map(item => item.score),
        },
      ],
    };

    return <Chart data={chartData} />;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error.message}</Text>;
  }

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Credit Score History</Text>
        {renderChart()}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Your credit score history shows how your credit score has changed over time. 
            Regularly checking your credit score can help you understand your financial health 
            and identify areas for improvement.
          </Text>
        </View>
      </ScrollView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
  },
  title: {
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.medium,
  },
  noDataText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.large,
  },
  errorText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.large,
  },
  infoContainer: {
    marginTop: theme.spacing.large,
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
  },
  infoText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text,
    lineHeight: 20,
  },
});

export default CreditScoreHistoryScreen;

// Human tasks:
// 1. Implement actual integration with the credit score service API
// 2. Design and implement a custom chart component for better visualization of credit score history
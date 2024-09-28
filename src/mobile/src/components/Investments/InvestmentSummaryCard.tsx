import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Define the props interface
interface InvestmentSummaryCardProps {
  title: string;
  currentValue: number;
  initialValue: number;
  returnPercentage: number;
}

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

// Helper function to format percentage
const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

const InvestmentSummaryCard: React.FC<InvestmentSummaryCardProps> = ({
  title,
  currentValue,
  initialValue,
  returnPercentage,
}) => {
  const totalReturn = currentValue - initialValue;
  const isPositiveReturn = returnPercentage >= 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.currentValue}>{formatCurrency(currentValue)}</Text>
      <View style={styles.returnContainer}>
        <Text style={styles.returnLabel}>Total Return:</Text>
        <Text style={[styles.returnValue, isPositiveReturn ? styles.positiveReturn : styles.negativeReturn]}>
          {formatCurrency(totalReturn)}
        </Text>
      </View>
      <Text style={[styles.returnPercentage, isPositiveReturn ? styles.positiveReturn : styles.negativeReturn]}>
        {formatPercentage(returnPercentage)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  currentValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  returnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  returnLabel: {
    fontSize: 14,
    color: '#666',
  },
  returnValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  returnPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveReturn: {
    color: '#4CAF50',
  },
  negativeReturn: {
    color: '#F44336',
  },
});

export default InvestmentSummaryCard;

// TODO: Implement actual investment data fetching logic
// TODO: Add error handling for invalid or missing data
// TODO: Implement unit tests for the InvestmentSummaryCard component
// TODO: Add accessibility features to the component
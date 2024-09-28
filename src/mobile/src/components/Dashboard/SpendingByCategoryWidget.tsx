import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTransactions } from '../../hooks/useTransactions';
import { Chart } from '../common/Chart';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';

interface SpendingData {
  category: string;
  amount: number;
}

const SpendingByCategoryWidget: React.FC = () => {
  const navigation = useNavigation();
  const { transactions, isLoading, error } = useTransactions();
  const [spendingData, setSpendingData] = useState<SpendingData[]>([]);

  useEffect(() => {
    if (transactions) {
      const processedData = processTransactions(transactions);
      setSpendingData(processedData);
    }
  }, [transactions]);

  const processTransactions = (transactions: any[]): SpendingData[] => {
    const categoryTotals: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      const { category, amount } = transaction;
      if (categoryTotals[category]) {
        categoryTotals[category] += amount;
      } else {
        categoryTotals[category] = amount;
      }
    });

    const sortedData = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    return sortedData;
  };

  const handleWidgetPress = () => {
    // Navigate to a detailed spending by category view
    // This is a pending human task and needs to be implemented
    navigation.navigate('SpendingByCategoryDetail');
  };

  if (isLoading) {
    return (
      <Card>
        <Text>Loading spending data...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Text>Error loading spending data. Please try again.</Text>
      </Card>
    );
  }

  return (
    <TouchableOpacity onPress={handleWidgetPress}>
      <Card>
        <Text style={styles.title}>Spending by Category</Text>
        <Chart
          data={spendingData}
          xKey="category"
          yKey="amount"
          // The color scheme is a pending human task and needs to be implemented
        />
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Spending:</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(spendingData.reduce((sum, item) => sum + item.amount, 0))}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SpendingByCategoryWidget;
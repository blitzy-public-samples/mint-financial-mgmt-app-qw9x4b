import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BudgetProgressBar } from '../components/Budgets/BudgetProgressBar';
import { useBudgets } from '../hooks/useBudgets';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

interface Budget {
  id: string;
  name: string;
  currentAmount: number;
  totalAmount: number;
}

export const BudgetsOverviewScreen: React.FC = () => {
  const navigation = useNavigation();
  const { budgets, isLoading, error } = useBudgets();

  const renderBudgetItem = ({ item }: { item: Budget }) => (
    <Card>
      <Text style={styles.budgetName}>{item.name}</Text>
      <Text style={styles.budgetAmount}>
        ${item.currentAmount.toFixed(2)} / ${item.totalAmount.toFixed(2)}
      </Text>
      <BudgetProgressBar
        currentAmount={item.currentAmount}
        totalAmount={item.totalAmount}
      />
      <Button
        title="View Details"
        onPress={() => navigation.navigate('BudgetDetails', { budgetId: item.id })}
      />
    </Card>
  );

  if (isLoading) {
    return <Text>Loading budgets...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={budgets}
        renderItem={renderBudgetItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={styles.header}>Your Budgets</Text>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No budgets found. Create one to get started!</Text>
        }
      />
      <Button
        title="Create New Budget"
        onPress={() => navigation.navigate('CreateBudget')}
        style={styles.createButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  budgetName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  budgetAmount: {
    fontSize: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
  createButton: {
    marginTop: 16,
  },
});

// TODO: Implement error handling for budget data fetching
// TODO: Add pull-to-refresh functionality for updating budget data
// TODO: Implement sorting and filtering options for budgets
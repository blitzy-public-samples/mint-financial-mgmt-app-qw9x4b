import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useBudgets } from '../../hooks/useBudgets';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Chart from '../../components/common/Chart';
import Loader from '../../components/common/Loader';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import { formatCurrency } from '../../utils/formatters';
import { BudgetDetailsScreenProps } from '../../types/navigation.types';
import { Budget } from '../../types/budget.types';

const BudgetDetailsScreen: React.FC<BudgetDetailsScreenProps> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { budgetId } = route.params as { budgetId: string };
  const { getBudgetById, updateBudget, deleteBudget } = useBudgets();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBudgetDetails();
  }, [budgetId]);

  const fetchBudgetDetails = async () => {
    try {
      setIsLoading(true);
      const budgetDetails = await getBudgetById(budgetId);
      setBudget(budgetDetails);
      setError(null);
    } catch (err) {
      setError('Failed to fetch budget details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBudget = () => {
    navigation.navigate('EditBudget', { budgetId });
  };

  const handleDeleteBudget = async () => {
    try {
      await deleteBudget(budgetId);
      navigation.goBack();
    } catch (err) {
      setError('Failed to delete budget. Please try again.');
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={fetchBudgetDetails} />
      </View>
    );
  }

  if (!budget) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Budget not found</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container}>
        <Card>
          <Text style={styles.title}>{budget.name}</Text>
          <Text style={styles.amount}>{formatCurrency(budget.amount)}</Text>
          <Text style={styles.period}>{budget.period}</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(budget.spent / budget.amount) * 100}%` },
                ]}
              />
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <Chart
            // Implement actual chart visualization here
            data={budget.spendingByCategory}
            type="pie"
            height={200}
          />
        </Card>

        <View style={styles.buttonContainer}>
          <Button title="Edit Budget" onPress={handleEditBudget} />
          <Button title="Delete Budget" onPress={handleDeleteBudget} variant="danger" />
        </View>
      </ScrollView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amount: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  period: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 4,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default BudgetDetailsScreen;
```

This implementation of the BudgetDetailsScreen component follows the specifications provided and includes the following features:

1. Fetches budget details using the `useBudgets` hook (assumed to have a `getBudgetById` function).
2. Displays loading state while fetching data.
3. Shows an error message if fetching fails, with a retry option.
4. Renders budget details including name, amount, period, and progress.
5. Includes a placeholder for a chart to show spending by category.
6. Provides options to edit or delete the budget.

Note that I've made some assumptions about the structure of the `Budget` type and the `useBudgets` hook. You may need to adjust these based on your actual implementations.

Here are the pending human tasks as comments within the file:

```typescript
// TODO: Implement actual chart visualization for spending by category
// TODO: Integrate with a state management solution (e.g., Redux) for more efficient data handling
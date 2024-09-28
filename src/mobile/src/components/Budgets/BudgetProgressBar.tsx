import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

// TODO: Import theme once it's implemented
// import { theme } from '../../constants/theme';

interface BudgetProgressBarProps {
  currentAmount: number;
  budgetAmount: number;
  category: string;
}

const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  currentAmount,
  budgetAmount,
  category,
}) => {
  const calculateProgress = (): number => {
    const progress = currentAmount / budgetAmount;
    return Math.min(Math.max(progress, 0), 1);
  };

  const getProgressColor = (progress: number): string => {
    if (progress < 0.5) return '#4CAF50'; // Green
    if (progress < 0.75) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  const progress = calculateProgress();
  const progressColor = getProgressColor(progress);

  return (
    <View style={styles.container}>
      <Text style={styles.categoryText}>{category}</Text>
      <ProgressBar
        progress={progress}
        color={progressColor}
        style={styles.progressBar}
      />
      <Text style={styles.amountText}>
        ${currentAmount.toFixed(2)} / ${budgetAmount.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  amountText: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default BudgetProgressBar;

// TODO: Implement proper error handling for edge cases (e.g., when budgetAmount is 0)
// TODO: Add accessibility features to the component
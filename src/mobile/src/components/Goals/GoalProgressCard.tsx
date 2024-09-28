import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';

// Assuming these are the correct imports based on the JSON specification
import { theme } from '../../../constants/theme';
import { formatCurrency } from '../../../utils/formatters';

interface GoalProgressCardProps {
  goal: {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
  };
  onPress: () => void;
}

const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goal, onPress }) => {
  const progress = useMemo(() => {
    return goal.currentAmount / goal.targetAmount;
  }, [goal.currentAmount, goal.targetAmount]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{goal.name}</Text>
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>
          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
        </Text>
      </View>
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
        <Text style={styles.progressText}>{(progress * 100).toFixed(0)}%</Text>
      </View>
      <Text style={styles.deadlineText}>
        Deadline: {goal.deadline.toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: 16,
    marginVertical: 8,
    ...theme.shadows.small,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.colors.text,
  },
  deadlineText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});

export default GoalProgressCard;

// Human tasks:
// TODO: Implement error handling for cases where goal data is incomplete or invalid
// TODO: Add accessibility labels and hints for better screen reader support
// TODO: Consider adding animations for progress updates